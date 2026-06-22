const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
}

const ESCAPE_RE = new RegExp(`[${Object.keys(ESCAPE_MAP).join("")}]`, "g")

function escapeHtml(str: string): string {
  return str.replace(ESCAPE_RE, (c) => ESCAPE_MAP[c])
}

export function sanitizeHtml(str: string): string {
  return escapeHtml(str).replace(/\n/g, "<br />")
}
