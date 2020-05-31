
const ncname = `[a-zA-Z_][\\-\\.0-9a-zA-Z]*`;

const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`)

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

const attribute = /^/



export function compileToFunction (templete) {


  return function render () {

  }
}

