const SCRIPT_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const STYLE_TAG_RE = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi
const EVENT_RE = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi
const IFRAME_RE = /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi
const OBJECT_RE = /<object\b[^>]*>[\s\S]*?<\/object>/gi
const EMBED_RE = /<embed\b[^>]*\/?>/gi
const FORM_RE = /<form\b[^>]*>[\s\S]*?<\/form>/gi
const SVG_SCRIPT_RE = /<svg\b[^>]*>[\s\S]*?<\/svg>/gi
const STYLE_EXPR_RE = /expression\s*\(/gi
const JS_URI_RE = /(href|src|action)\s*=\s*["']?\s*javascript\s*:/gi
const DATA_URI_RE = /(href|src|action)\s*=\s*["']?\s*data\s*:/gi
const VBS_URI_RE = /(href|src|action)\s*=\s*["']?\s*vbscript\s*:/gi
const BASE_RE = /<base\b[^>]*\/?>/gi
const META_RE = /<meta\b[^>]*\/?>/gi
const LINK_RE = /<link\b[^>]*\/?>/gi

export function sanitizeHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(SCRIPT_RE, "")
    .replace(STYLE_TAG_RE, "")
    .replace(IFRAME_RE, "")
    .replace(OBJECT_RE, "")
    .replace(EMBED_RE, "")
    .replace(FORM_RE, "")
    .replace(SVG_SCRIPT_RE, "")
    .replace(BASE_RE, "")
    .replace(META_RE, "")
    .replace(LINK_RE, "")
    .replace(EVENT_RE, "")
    .replace(STYLE_EXPR_RE, "")
    .replace(JS_URI_RE, '$1="')
    .replace(DATA_URI_RE, '$1="')
    .replace(VBS_URI_RE, '$1="')
}
