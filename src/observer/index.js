import { isObject, isType, def } from '../util/index'
import { arrayMethods } from './array.js'

class Observer {
  constructor (data) {

    // data.__ob__ = this
    def(data, '__ob__', this)

    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods
      this.observerArray(data)
    } else {
      this.walk(data)
    }

  }
  observerArray (data) {
    data.forEach(val => {
      observe(val)
    })
  }

  walk (data) {
    let keys = Object.keys(data)

    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }

}

function defineReactive (data, key, val) {
  observe(val)
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get () {
      return val
    },
    set (newVal) {
      if (newVal === val) return
      observe(newVal)
      val = newVal
    }
  })
}
export function observe (data) {
  if (!isObject(data)) return

  return new Observer(data)
}