const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

const stack = []
const ELEMENT_TYPE = 3
const TEXT_TYPE = 1

let root = null
let currentParent = null


function createASTElement (tag, attrs) {
  return {
    type: ELEMENT_TYPE,
    tag,
    attrs,
    children: [],
    parent: null
  }
}

function start ({ tag, attrs }) {
  let el = createASTElement(tag, attrs)

  if (!root) root = el

  currentParent = el

  stack.push(el)
}

function chars (text) {
  text = text.trim()
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}

function end () {

  let el = stack.pop()

  currentParent = stack[stack.length - 1]

  if (currentParent) {
    el.parent = currentParent
    currentParent.children.push(el)
  }
}

export function parseHTML (html) {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      let startTagMatch = parseStartTag(html);
      if (startTagMatch) {
        start(startTagMatch)
        continue
      }

      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch)
        advance(endTagMatch[0].length)
        continue
      }
    }

    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }

    if (text) {
      chars(text)
      advance(text.length)
    }
  }

  function advance (n) {
    html = html.substring(n)
  }

  function parseStartTag () {
    let start = html.match(startTagOpen)

    if (start) {
      const match = {
        tag: start[1],
        attrs: []
      }
      advance(start[0].length)

      let end
      let attr

      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }

      if (end) {
        advance(end[0].length)
        return match
      }
    }

  }

  return root
}