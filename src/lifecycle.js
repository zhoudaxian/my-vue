import Watcher from './observer/warcher'
import { patch } from './vdom/patch'


let updateComponent = (vm) => {
  // return vdom
  // vdom => dom
  vm._update(vm._render())
}
export function mountComponent (vm, el) {
  const { options: opts } = vm

  vm.$el = el

  callHook(vm, 'beforeMount')

  // renderWatcher args->true
  new Watcher(vm, () => updateComponent(vm), () => { }, true)

  callHook(vm, 'mounted')
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this

    vm.$el = patch(vm.$el, vnode)
  }
}

export function callHook (vm, hook) {
  const handlers = vm.$options[hook]
  handlers && handlers.forEach(handler => handler.call(vm))
}