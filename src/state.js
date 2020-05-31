import { observe } from './observer/index.js'
export function initState (vm) {
  console.log('init state')

  const opts = vm.$options


  if (opts.props) {
    initProps(vm)
  }

  if (opts.methods) {
    initMethod(vm)
  }

  if (opts.data) {
    initData(vm)
  }

  if (opts.computed) {
    initComputed(vm)
  }

  if (opts.watch) {
    initWatch(vm)
  }


}

function initProps (vm) {
  console.log('init props')
}

function initMethod (vm) {
  console.log('init method')
}

function initData (vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data

  observe(data)
  console.log('init data', data)
}

function initComputed (vm) {
  console.log('init computed')
}

function initWatch (vm) {
  console.log('init watch')
}