const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

const oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const ob = this.__ob__
    let ret = oldArrayMethods[method].apply(this, args)

    let inserted;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2)
      default:
        break;
    }

    if (inserted) ob.observerArray(inserted)

    ob.dep.notify()

    return ret
  }
})