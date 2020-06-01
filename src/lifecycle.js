import Watcher from './observer/warcher'
import { patch } from './vdom/patch'

export function mountComponent (vm, el) {
  const { options: opts } = vm

  vm.$el = el

  let updateComponent = () => {
    // return vdom
    // vdom => dom
    vm._update(vm._render())
  }

  // renderWatcher args->true
  new Watcher(vm, updateComponent, () => { }, true)
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this

    vm.$el = patch(vm.$el, vnode)
  }
}