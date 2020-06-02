import { initState } from './state'
import { compileToFunction } from './compiler/index'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './util/index'
import { nextTick } from './util/next-tick'

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = mergeOptions(vm.constructor.options, options)

    callHook(vm, 'beforeCreate')

    initState(vm);

    callHook(vm, 'created')

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
    } else {
      templete = el.outerHTML
      render = compileToFunction(templete)
    }

    opts.render = render

    mountComponent(vm, el)
  }


  Vue.prototype.$nextTick = nextTick
}


