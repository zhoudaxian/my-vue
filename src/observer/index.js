import { isObject, isType, def } from '../util/index'
import { arrayMethods } from './array.js'
import Dep from './dep'

class Observer {
  constructor (data) {
    this.dep = new Dep()

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
  const dep = new Dep()

  const childOb = observe(val)

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get () {
      if (Dep.target) {
        dep.depend()

        // array dep收集watcher
        if (childOb) {
          childOb.dep.depend()

          if (Array.isArray(val)) {
            dependArray(val)
          }
        }

      }
      return val
    },
    set (newVal) {
      if (newVal === val) return
      observe(newVal)
      val = newVal

      dep.notify()
    }
  })
}
export function observe (data) {
  if (!isObject(data)) return

  return new Observer(data)
}


function dependArray (arr) {
  arr.forEach(val => {
    const { __ob__: ob } = val
    ob && ob.dep.depend()
    if (Array.isArray(val)) {
      dependArray(val)
    }
  })
}