"use server"

import { resend } from "@/lib/resend"

type ContactFormState = {
  success: boolean
  error: string | null
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SUBJECT_OPTIONS = [
  "Vraag over een product",
  "Bestelling & verzending",
  "Samenwerking",
  "Overig",
] as const

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim() ?? ""
  const email = formData.get("email")?.toString().trim() ?? ""
  const subject = formData.get("subject")?.toString().trim() ?? ""
  const message = formData.get("message")?.toString().trim() ?? ""
  const consent = formData.get("consent")?.toString() === "on"

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Alle velden zijn verplicht." }
  }

  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return { success: false, error: "Een van de velden overschrijdt de maximale lengte." }
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Voer een geldig e-mailadres in." }
  }

  if (!SUBJECT_OPTIONS.includes(subject as (typeof SUBJECT_OPTIONS)[number])) {
    return { success: false, error: "Selecteer een geldig onderwerp." }
  }

  if (!consent) {
    return {
      success: false,
      error: "U moet akkoord gaan met de verwerking van uw gegevens.",
    }
  }

  const contactEmail = process.env.CONTACT_EMAIL
  if (!contactEmail) {
    console.error("CONTACT_EMAIL environment variable is not set")
    return {
      success: false,
      error: "Er is een fout opgetreden. Probeer het later opnieuw.",
    }
  }

  try {
    await resend.emails.send({
      from: "Inovix Contact <noreply@inovix.eu>",
      to: contactEmail,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: [
        `Naam: ${name}`,
        `E-mail: ${email}`,
        `Onderwerp: ${subject}`,
        "",
        "Bericht:",
        message,
      ].join("\n"),
    })

    return { success: true, error: null }
  } catch (err) {
    console.error("Failed to send contact email:", err)
    return {
      success: false,
      error: "Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.",
    }
  }
}
