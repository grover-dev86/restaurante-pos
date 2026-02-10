import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PasswordChangedEmailProps {
  name: string
  loginLink: string
}

export function PasswordChangedEmail({ name, loginLink }: PasswordChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu contraseña ha sido actualizada - Restaurante POS</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Restaurante POS</Heading>
          <Text style={text}>Hola {name},</Text>
          <Text style={text}>
            Te confirmamos que tu contraseña ha sido actualizada exitosamente.
          </Text>
          <Section style={infoBox}>
            <Text style={infoText}>
              Si no realizaste este cambio, por favor contacta a soporte inmediatamente.
            </Text>
          </Section>
          <Text style={text}>
            Ya puedes iniciar sesión con tu nueva contraseña:
          </Text>
          <Section style={buttonContainer}>
            <Link href={loginLink} style={button}>
              Iniciar sesión
            </Link>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Este es un correo automático de seguridad. Si no solicitaste este cambio,
            te recomendamos cambiar tu contraseña inmediatamente y revisar la actividad de tu cuenta.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '560px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
}

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
}

const infoBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
}

const infoText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#0f172a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 8px',
}
