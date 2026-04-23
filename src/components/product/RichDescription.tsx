import sanitizeHtml from "sanitize-html"

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "code",
    "pre",
    "img",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "alt", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
}

type Props = {
  html: string
  className?: string
}

export function RichDescription({ html, className }: Props) {
  const clean = sanitizeHtml(html, SANITIZE_OPTIONS)

  return (
    <div
      className={`rich-description max-w-prose text-sm leading-relaxed text-navy-500 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
