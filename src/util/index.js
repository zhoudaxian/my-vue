
function toCaption (str) {
  if (typeof str !== 'string') throw Error('toCaption\'s parmas must be a string')

  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

export function isObject (data) {
  return data && typeof data === 'object'
}

export function isType (data, type) {
  return ({}).toString.call(data) === `[object ${toCaption(type)}]`
}

export function def (data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    writable: true,
    value: val
  })
}