(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function toCaption(str) {
    if (typeof str !== 'string') throw Error('toCaption\'s parmas must be a string');
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  function isObject(data) {
    return data && typeof data === 'object';
  }
  function isType(data, type) {
    return {}.toString.call(data) === `[object ${toCaption(type)}]`;
  }
  function def(data, key, val) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: val
    });
  }

  const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  const oldArrayMethods = Array.prototype;
  const arrayMethods = Object.create(oldArrayMethods);
  methods.forEach(method => {
    arrayMethods[method] = function (...args) {
      console.log('arrayMethods');
      const ob = this.__ob__;
      let ret = oldArrayMethods[method].apply(this, args);
      let inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case splice:
          inserted = args.slice(2);
      }

      if (inserted) ob.observerArray(inserted);
      return ret;
    };
  });

  class Observer {
    constructor(data) {
      // data.__ob__ = this
      def(data, '__ob__', this);

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observerArray(data);
      } else {
        this.walk(data);
      }
    }

    observerArray(data) {
      data.forEach(val => {
        observe(val);
      });
    }

    walk(data) {
      let keys = Object.keys(data);
      keys.forEach(key => {
        defineReactive(data, key, data[key]);
      });
    }

  }

  function defineReactive(data, key, val) {
    observe(val);
    Object.defineProperty(data, key, {
      get() {
        return val;
      },

      set(newVal) {
        if (newVal === val) return;
        observe(newVal);
        val = newVal;
      }

    });
  }

  function observe(data) {
    console.log('observe', data, isType(data, 'object'));
    if (!isObject(data)) return;
    return new Observer(data);
  }

  function initState(vm) {
    console.log('init state');
    const opts = vm.$options;

    if (opts.props) {
      initProps();
    }

    if (opts.methods) {
      initMethod();
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed();
    }

    if (opts.watch) {
      initWatch();
    }
  }

  function initProps(vm) {
    console.log('init props');
  }

  function initMethod(vm) {
    console.log('init method');
  }

  function initData(vm) {
    let data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;
    observe(data);
    console.log('init data', data);
  }

  function initComputed(vm) {
    console.log('init computed');
  }

  function initWatch(vm) {
    console.log('init watch');
  }

  function compileToFunction(templete) {
    return function render() {};
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      console.log('_init');
      const vm = this;
      vm.$options = options;
      initState(vm);
      if (vm.$options.el) vm.$mount(vm.$options.el);
    };

    Vue.prototype.$mount = function (el) {
      const vm = this;
      const opts = vm.$options;
      el = document.querySelector(el);
      let templete;
      let render; // priority  render-> template -> el

      if (opts.render) {
        render = opts.render;
      } else if (opts.templete) {
        templete = opts.templete;
        render = compileToFunction();
        opts.render = render;
      } else {
        templete = el.outerHTML;
      }
    };
  }

  function Vue(options) {
    // console.log(options)
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
