
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`

const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`)

const startTagClose = /^\s*(\/?)>/

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g



function parserHTML (html) {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      let startTagMatch = parseStartTag(html);
      if (startTagMatch) {
        continue
      }

      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        continue
      }
    }

    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }

    if (text) {
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
        tagName: start[1],
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
        console.log(match, html)
        return match
      }
    }

  }
}

export function compileToFunction (templete) {

  parserHTML(templete)
  return function render () {

  }
}

