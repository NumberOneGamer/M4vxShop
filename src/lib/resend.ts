import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = "M4VX <noreply@m4vx.com>"
export const CONTACT_EMAIL = "support@m4vx.com"
