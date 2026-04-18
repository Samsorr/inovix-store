export interface EuCountry {
  code: string
  name: string
}

export const EU_COUNTRIES: EuCountry[] = [
  { code: "nl", name: "Nederland" },
  { code: "be", name: "België" },
  { code: "de", name: "Duitsland" },
  { code: "fr", name: "Frankrijk" },
  { code: "at", name: "Oostenrijk" },
  { code: "it", name: "Italië" },
  { code: "es", name: "Spanje" },
  { code: "pt", name: "Portugal" },
  { code: "ie", name: "Ierland" },
  { code: "lu", name: "Luxemburg" },
  { code: "fi", name: "Finland" },
  { code: "se", name: "Zweden" },
  { code: "dk", name: "Denemarken" },
  { code: "pl", name: "Polen" },
  { code: "cz", name: "Tsjechië" },
  { code: "sk", name: "Slowakije" },
  { code: "hu", name: "Hongarije" },
  { code: "ro", name: "Roemenië" },
  { code: "bg", name: "Bulgarije" },
  { code: "hr", name: "Kroatië" },
  { code: "si", name: "Slovenië" },
  { code: "ee", name: "Estland" },
  { code: "lv", name: "Letland" },
  { code: "lt", name: "Litouwen" },
  { code: "mt", name: "Malta" },
  { code: "cy", name: "Cyprus" },
  { code: "gr", name: "Griekenland" },
]

export function countryName(code: string): string {
  return EU_COUNTRIES.find((c) => c.code === code)?.name ?? code.toUpperCase()
}
