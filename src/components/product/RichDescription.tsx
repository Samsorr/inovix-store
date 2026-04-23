import DOMPurify from "isomorphic-dompurify"

const ALLOWED_TAGS = [
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
]

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title"]

type Props = {
  html: string
  className?: string
}

export function RichDescription({ html, className }: Props) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/)/i,
  })

  return (
    <div
      className={`rich-description max-w-prose text-sm leading-relaxed text-navy-500 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
