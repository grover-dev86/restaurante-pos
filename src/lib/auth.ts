import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from './auth.config'

// Schema de validación para login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validar credenciales
          const { email, password } = loginSchema.parse(credentials)

          // Buscar usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
          })

          if (!user) {
            return null
          }

          // Verificar que el usuario esté activo
          if (!user.isActive) {
            return null
          }

          // Verificar contraseña
          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword) {
            return null
          }

          // Retornar datos del usuario para la sesión.
          // `image` es campo estándar de NextAuth: lo poblamos con
          // user.avatar para que aparezca en session.user.image
          // automáticamente (NextAuth lo guarda como token.picture).
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role.name,
            roleId: user.roleId,
          }
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      },
    }),
  ],
})
