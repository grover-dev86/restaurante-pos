import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Configuración base de NextAuth (sin Prisma para edge runtime)
export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // authorize se implementa en auth.ts con Prisma
      authorize: async () => null,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage =
        nextUrl.pathname.startsWith('/login') ||
        nextUrl.pathname.startsWith('/forgot-password') ||
        nextUrl.pathname.startsWith('/reset-password')
      const isPublicPage =
        nextUrl.pathname === '/' ||
        nextUrl.pathname.startsWith('/productos') ||
        nextUrl.pathname.startsWith('/menu')

      // Si no está logueado y trata de acceder a una página protegida
      if (!isLoggedIn && !isAuthPage && !isPublicPage) {
        return false // Redirige a signIn page
      }

      // Si está logueado y trata de acceder a la página de login (no aplica a forgot/reset)
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
    async jwt({ token, user }) {
      // Agregar datos adicionales al token JWT
      if (user) {
        token.id = user.id
        token.role = user.role
        token.roleId = user.roleId
      }
      return token
    },
    async session({ session, token }) {
      // Agregar datos del token a la sesión
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.roleId = token.roleId as string
      }
      return session
    },
  },
}
