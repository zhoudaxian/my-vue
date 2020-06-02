
function toCaption (str) {
  if (typeof str !== 'string') throw Error('toCaption\'s parmas must be a string')

  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

export function isObject (data) {
  return data && typeof data === 'object'
}

export function isType (data, type) {
  return ({}).toString.call(data) === `[object ${toCaption(type)}]`
}

export function def (data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    writable: true,
    value: val
  })
}

export function proxy (vm, source, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[source][key]
    },
    set (newVal) {
      vm[source][key] = newVal
    }
  })
}

const LIFTCYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destotyed',
  'activated',
  'deactivated',
  'errorCaptured'
]

const strats = {}

LIFTCYCLE_HOOKS.forEach(hook => strats[hook] = mergeHook)

function mergeHook (targetHooks, sourceHooks) {
  if (sourceHooks) {
    return targetHooks ? targetHooks.concat(sourceHooks) : [sourceHooks]
  }
  return targetHooks
}

export function mergeOptions (target, source) {
  const opts = {}
  const targetKeys = Object.keys(target)
  const sourceKeys = Object.keys(source)

  targetKeys.forEach(key => {
    if (LIFTCYCLE_HOOKS.includes(key)) {
      opts[key] = strats[key](target[key], source[key])
    } else if (isObject(key)) {
      opts[key] = mergeOptions(target[key], source[key])
    } else {
      opts[key] = source[key] == null ? target[key] : source[key]
    }
  })

  sourceKeys.forEach(key => {
    if (LIFTCYCLE_HOOKS.includes(key)) {
      opts[key] = strats[key](target[key], source[key])
    } else if (!opts[key]) {
      opts[key] = source[key]
    }
  })

  return opts
}