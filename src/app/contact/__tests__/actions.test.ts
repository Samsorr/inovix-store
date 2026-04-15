import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({}),
    },
  },
}))

import { submitContactForm } from "@/app/contact/actions"
import { resend } from "@/lib/resend"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return fd
}

const validFields = {
  name: "Jan de Vries",
  email: "jan@example.com",
  subject: "Vraag over een product",
  message: "Ik heb een vraag over BPC-157.",
}

const prevState = { success: false, error: null }

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  process.env.CONTACT_EMAIL = "info@inovix.eu"
})

describe("submitContactForm", () => {
  describe("validation", () => {
    it("returns an error when name is missing", async () => {
      const fd = makeFormData({ ...validFields, name: "" })
      const result = await submitContactForm(prevState, fd)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Alle velden zijn verplicht.")
    })

    it("returns an error when email is missing", async () => {
      const fd = makeFormData({ ...validFields, email: "" })
      const result = await submitContactForm(prevState, fd)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Alle velden zijn verplicht.")
    })

    it("returns an error when email format is invalid", async () => {
      const fd = makeFormData({ ...validFields, email: "not-an-email" })
      const result = await submitContactForm(prevState, fd)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Voer een geldig e-mailadres in.")
    })

    it("returns an error when subject is not one of the valid options", async () => {
      const fd = makeFormData({ ...validFields, subject: "Invalid subject" })
      const result = await submitContactForm(prevState, fd)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Selecteer een geldig onderwerp.")
    })

    it("returns an error when message is missing", async () => {
      const fd = makeFormData({ ...validFields, message: "" })
      const result = await submitContactForm(prevState, fd)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Alle velden zijn verplicht.")
    })
  })

  describe("environment", () => {
    it("returns an error when CONTACT_EMAIL env var is not set", async () => {
      delete process.env.CONTACT_EMAIL
      const spy = vi.spyOn(console, "error").mockImplementation(() => {})

      const fd = makeFormData(validFields)
      const result = await submitContactForm(prevState, fd)

      expect(result.success).toBe(false)
      expect(result.error).toBe(
        "Er is een fout opgetreden. Probeer het later opnieuw."
      )

      spy.mockRestore()
    })
  })

  describe("successful submission", () => {
    it("sends the email with correct params and returns success", async () => {
      const fd = makeFormData(validFields)
      const result = await submitContactForm(prevState, fd)

      expect(result).toEqual({ success: true, error: null })

      expect(resend.emails.send).toHaveBeenCalledTimes(1)
      expect(resend.emails.send).toHaveBeenCalledWith({
        from: "Inovix Contact <noreply@inovix.eu>",
        to: "info@inovix.eu",
        replyTo: "jan@example.com",
        subject: "[Contact] Vraag over een product",
        text: expect.stringContaining("Naam: Jan de Vries"),
      })
    })

    it("accepts all four valid subject options", async () => {
      const subjects = [
        "Vraag over een product",
        "Bestelling & verzending",
        "Samenwerking",
        "Overig",
      ]

      for (const subject of subjects) {
        vi.mocked(resend.emails.send).mockResolvedValue({} as never)
        const fd = makeFormData({ ...validFields, subject })
        const result = await submitContactForm(prevState, fd)
        expect(result.success).toBe(true)
      }
    })
  })

  describe("Resend API failure", () => {
    it("returns a user-friendly error when the email service fails", async () => {
      vi.mocked(resend.emails.send).mockRejectedValue(
        new Error("Resend API down")
      )
      const spy = vi.spyOn(console, "error").mockImplementation(() => {})

      const fd = makeFormData(validFields)
      const result = await submitContactForm(prevState, fd)

      expect(result.success).toBe(false)
      expect(result.error).toBe(
        "Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw."
      )

      spy.mockRestore()
    })
  })
})
