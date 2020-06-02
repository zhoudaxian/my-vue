import { initMixin } from './init'
import { renderMixin } from './render'
import { lifecycleMixin } from './lifecycle'
import { initGlobalAPI } from './globalAPI/index'

function Vue (options) {
  this._init(options)
}

initMixin(Vue)

renderMixin(Vue)

lifecycleMixin(Vue)

initGlobalAPI(Vue)
export default Vue
