const ELEMENT_TYPE = 1
const TEXT_TYPE = 3
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genProps (attrs) {
  let str = ''
  attrs.forEach(attr => {
    switch (attr.name) {
      case 'style':
        let obj = {}
        attr.value.split(';').forEach(item => {
          const [key, val] = item.split(':')
          obj[key] = val
        })
        attr.value = obj
        break;
      default:
        break;
    }
    str += `"${attr.name}":${JSON.stringify(attr.value)},`
  })

  return `{${str.slice(0, -1)}}`
}

function genChildren (children) {
  return `${children.map(genChild).join(',')}`
}

function genChild (child) {
  if (child.type === ELEMENT_TYPE) {
    return generate(child)
  } else {

    let { text } = child
    let tokens = []
    let match = null
    let index = -1
    let lastIndex = defaultTagRE.lastIndex = 0

    while (match = defaultTagRE.exec(text)) {
      index = match.index

      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    return `_v(${tokens.join('+')})`
  }
}
export function generate (el) {
  const { tag, children, attrs } = el

  let code = `
    _c("${tag}",
      ${ (attrs && attrs.length > 0) ? genProps(attrs) : 'undefined'},
      ${ (children && children.length > 0) ? genChildren(children) : ''}
    )
    `

  return code
}