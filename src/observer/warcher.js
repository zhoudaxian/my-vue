class Watcher {
  constructor (vm, exprOrFn, callback, options) {
    this.vm = vm
    this.callback = callback
    this.options = options

    this.getter = exprOrFn

    this.get()
  }

  get () {
    this.getter()
  }

  update () {

  }

  notify () {

  }
}


export default Watcher