import { Resend } from 'resend'

// Solo crear instancia si hay API key configurada
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null
