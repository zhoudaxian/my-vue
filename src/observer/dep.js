

let id = 0
const stack = []

export default class Dep {
  constructor () {
    this.id = id++
    this.subs = []

  }

  addSub (watcher) {
    this.subs.push(watcher)
  }

  // 收集依赖
  depend () {
    Dep.target.addDep(this)
  }

  notify () {
    this.subs.forEach(watcher => watcher.update())
  }

}

Dep.target = null

export function pushTarget (watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget () {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}