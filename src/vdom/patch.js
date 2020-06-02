


function creatElm (vnode) {
  const { tag, data, children, key, text } = vnode

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProps(vnode)
    children.forEach(child => { vnode.el.appendChild(creatElm(child)) })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProps (vnode) {
  const { el, data: newProps } = vnode

  for (let p in newProps) {
    if (p === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (p === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(p, newProps[p])
    }
  }

}

export function patch (oldVnode, vnode) {

  const isRealElement = oldVnode.nodeType

  if (isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode

    const el = creatElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)

    return el
  }
}