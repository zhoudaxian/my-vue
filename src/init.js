import { initState } from './state'
import { compileToFunction } from './compiler/index'



export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    console.log('_init')
    const vm = this
    vm.$options = options


    initState(vm);

    if (vm.$options.el) vm.$mount(vm.$options.el)


  }


  Vue.prototype.$mount = function (el) {
    const vm = this
    const opts = vm.$options
    el = document.querySelector(el)

    let templete
    let render
    // priority  render-> template -> el
    if (opts.render) {
      render = opts.render
    } else if (opts.templete) {
      templete = opts.templete
      render = compileToFunction(templete)
      opts.render = render
    } else {
      templete = el.outerHTML
    }



  }
}


