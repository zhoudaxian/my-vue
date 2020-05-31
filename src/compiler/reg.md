// const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
// const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// const startTagOpen = new RegExp(`^<${qnameCapture}`)
// const startTagClose = /^\s*(\/?)>/
// const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// const doctype = /^<!DOCTYPE [^>]+>/i
// const comment = /^<!\--/
// const conditionalComment = /^<!\[/
// const decodingMap = {
//   '&lt;': '<',
//   '&gt;': '>',
//   '&quot;': '"',
//   '&amp;': '&',
//   '&#10;': '\n',
//   '&#9;': '\t',
//   '&#39;': "'"
// }
// const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g
// const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g

// todo text
// const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
// const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

// todo html
// export const onRE = /^@|^v-on:/
// export const dirRE = process.env.VBIND_PROP_SHORTHAND
//   ? /^v-|^@|^:|^\.|^#/
//   : /^v-|^@|^:|^#/
// export const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
// export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
// const stripParensRE = /^\(|\)$/g
// const dynamicArgRE = /^\[.*\]$/

// const argRE = /:(.*)$/
// export const bindRE = /^:|^\.|^v-bind:/
// const propBindRE = /^\./
// const modifierRE = /\.[^.\]]+(?=[^\]]*$)/g

// const slotRE = /^v-slot(:|$)|^#/

// const lineBreakRE = /[\r\n]/
// const whitespaceRE = /\s+/g

// const invalidAttributeRE = /[\s"'<>\/=]/
