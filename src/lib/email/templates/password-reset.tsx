import {
  Body,
  Button,
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

interface PasswordResetEmailProps {
  name: string
  resetLink: string
}

export function PasswordResetEmail({ name, resetLink }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña - Restaurante POS</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Restaurante POS</Heading>
          <Text style={text}>Hola {name},</Text>
          <Text style={text}>
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste
            esta solicitud, puedes ignorar este correo.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Restablecer contraseña
            </Button>
          </Section>
          <Text style={text}>
            O copia y pega el siguiente enlace en tu navegador:
          </Text>
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>
          <Hr style={hr} />
          <Text style={footer}>
            Este enlace expirará en 1 hora por motivos de seguridad.
          </Text>
          <Text style={footer}>
            Si no solicitaste restablecer tu contraseña, ignora este correo o contacta a soporte si
            tienes alguna preocupación.
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

const link = {
  color: '#0066cc',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
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
