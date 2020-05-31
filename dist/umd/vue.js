
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function isObject(data) {
    return data && typeof data === 'object';
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

  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  const startTagClose = /^\s*(\/?)>/;
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

  function parserHTML(html) {
    while (html) {
      let textEnd = html.indexOf('<');

      if (textEnd === 0) {
        let startTagMatch = parseStartTag();

        if (startTagMatch) {
          continue;
        }

        let endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          continue;
        }
      }

      let text;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      let start = html.match(startTagOpen);

      if (start) {
        const match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        let end;
        let attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (end) {
          advance(end[0].length);
          console.log(match, html);
          return match;
        }
      }
    }
  }

  function compileToFunction(templete) {
    parserHTML(templete);
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
        render = compileToFunction(templete);
      } else {
        templete = el.outerHTML;
        render = compileToFunction(templete);
      }

      opts.render = render;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
