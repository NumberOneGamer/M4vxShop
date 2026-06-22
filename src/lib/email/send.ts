import { Resend } from "resend"
import { FROM_EMAIL } from "@/lib/resend"
import { getBaseUrl } from "@/lib/metadata"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactElement
  from?: string
}

export async function sendEmail({ to, subject, react, from }: SendEmailOptions) {
  if (process.env.RESEND_API_KEY === "re_placeholder" || !process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not configured — skipping email send")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from ?? FROM_EMAIL,
      to,
      subject,
      react,
    })

    if (error) {
      console.error("[email] Send failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error("[email] Unexpected error:", err)
    return { success: false, error: "Failed to send email" }
  }
}

export { getBaseUrl }
