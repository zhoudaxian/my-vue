
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
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(newVal) {
        vm[source][key] = newVal;
      }

    });
  }

  const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  const oldArrayMethods = Array.prototype;
  const arrayMethods = Object.create(oldArrayMethods);
  methods.forEach(method => {
    arrayMethods[method] = function (...args) {
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
      configurable: true,
      enumerable: true,

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

    for (let p in data) {
      proxy(vm, '_data', p);
    }

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
  const stack = [];
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  let root = null;
  let currentParent = null;

  function createASTElement(tag, attrs) {
    return {
      type: ELEMENT_TYPE,
      tag,
      attrs,
      children: [],
      parent: null
    };
  }

  function start({
    tag,
    attrs
  }) {
    let el = createASTElement(tag, attrs);
    if (!root) root = el;
    currentParent = el;
    stack.push(el);
  }

  function chars(text) {
    text = text.trim();

    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE
      });
    }
  }

  function end() {
    let el = stack.pop();
    currentParent = stack[stack.length - 1];

    if (currentParent) {
      el.parent = currentParent;
      currentParent.children.push(el);
    }
  }

  function parseHTML(html) {
    while (html) {
      let textEnd = html.indexOf('<');

      if (textEnd === 0) {
        let startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch);
          continue;
        }

        let endTagMatch = html.match(endTag);

        if (endTagMatch) {
          end();
          advance(endTagMatch[0].length);
          continue;
        }
      }

      let text;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
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
          tag: start[1],
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
          return match;
        }
      }
    }

    return root;
  }

  const ELEMENT_TYPE$1 = 1;
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    let str = '';
    attrs.forEach(attr => {
      switch (attr.name) {
        case 'style':
          let obj = {};
          attr.value.split(';').forEach(item => {
            const [key, val] = item.split(':');
            obj[key] = val;
          });
          attr.value = obj;
          break;
      }

      str += `"${attr.name}":${JSON.stringify(attr.value)},`;
    });
    return `{${str.slice(0, -1)}}`;
  }

  function genChildren(children) {
    return `${children.map(genChild).join(',')}`;
  }

  function genChild(child) {
    if (child.type === ELEMENT_TYPE$1) {
      return generate(child);
    } else {
      let {
        text
      } = child;
      let tokens = [];
      let match = null;
      let index = -1;
      let lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return `_v(${tokens.join('+')})`;
    }
  }

  function generate(el) {
    const {
      tag,
      children,
      attrs
    } = el;
    let code = `_c("${tag}",
    ${attrs && attrs.length > 0 ? genProps(attrs) : 'undefined'},
    ${children && children.length > 0 ? genChildren(children) : ''})`;
    return code;
  }

  function compileToFunction(templete) {
    // parse html
    const root = parseHTML(templete);
    const code = generate(root);
    const renderFn = new Function(`with(this){return ${code}}`);
    return renderFn;
  }

  class Watcher {
    constructor(vm, exprOrFn, callback, options) {
      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.getter = exprOrFn;
      this.get();
    }

    get() {
      this.getter();
    }

    update() {}

    notify() {}

  }

  function creatElm(vnode) {
    const {
      tag,
      data,
      children,
      key,
      text
    } = vnode;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProps(vnode);
      children.forEach(child => {
        vnode.el.appendChild(creatElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProps(vnode) {
    const {
      el,
      data: newProps
    } = vnode;

    for (let p in newProps) {
      if (p === 'style') {
        for (let styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (p === 'class') {
        el.className = newProps.class;
      } else {
        el.setAttribute(p, newProps[p]);
      }
    }
  }

  function patch(oldVnode, vnode) {
    console.log(oldVnode, vnode);
    const isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      const oldElm = oldVnode;
      const parentElm = oldElm.parentNode;
      const el = creatElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
    }
  }

  function mountComponent(vm, el) {
    vm.$el = el;

    let updateComponent = () => {
      // return vdom
      // vdom => dom
      vm._update(vm._render());
    }; // renderWatcher args->true


    new Watcher(vm, updateComponent, () => {}, true);
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      const vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
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
      mountComponent(vm, el);
    };
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag,
      data,
      key,
      children,
      text,
      componentOptios: {}
    };
  }

  function createElement(tag, data = {}, ...children) {
    const {
      key
    } = data;
    key && delete data.key;
    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function (...args) {
      return createElement(...args);
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : typeof val === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      const vm = this;
      const {
        render
      } = vm.$options;
      return render.call(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
