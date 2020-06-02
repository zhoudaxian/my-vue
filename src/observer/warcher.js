import { pushTarget, popTarget } from './dep'
import { queueWatcher } from './scheduler.js'

let id = 0

class Watcher {
  constructor (vm, exprOrFn, callback, options) {
    this.vm = vm
    this.callback = callback
    this.options = options
    this.id = id++
    this.depsId = new Set()
    this.deps = []

    this.getter = exprOrFn
    // new Watcher(vm, () => updateComponent(vm), () => { }, true)
    // 对于render watcher来讲，调用get/update方法 即调用updateComponent 去更新组件 PS：组件级更新
    // 注册 render watcher 是在beforeCreate 与created之间 mountComponent方法里
    // beforeCreate -> initState
    //  -> initData -> oberser -> defineReactive  ->
    // created -> $mounted -> 生成render函数 -> 调用mountComponent ->
    // beforeMount -> new Watcher(vm, () => updateComponent(vm), () => { }, true) // 会去读取数据，收集依赖 ->
    // mounted

    // 1.在组件初始化数据的时候，将数据变成响应式（Object.defineProperty）
    // 2.编辑模板生成render函数，

    // new Watcher(vm, () => updateComponent(vm), () => { }, true)
    // 3.添加renderwatcher,在newwatcher时，去调用get方法即vm._update(vm._render())。 生成vdom 生成真实dom ，挂载

    this.get()
  }
  addDep (dep) {
    const { id } = dep

    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  get () {
    pushTarget(this)

    this.getter()

    popTarget(this)
  }

  update () {
    queueWatcher(this)
  }

  run () {
    this.get()
  }
}


export default Watcher