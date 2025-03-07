// packages/reactivity/src/effect.ts
function effect() {
}

// packages/shared/src/index.ts
function isObj(val) {
  return typeof val === "object" && val !== null;
}

// packages/reactivity/src/reactive.ts
var targetMap = /* @__PURE__ */ new WeakMap();
var mutableHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
  },
  set(target, key, value, receiver) {
    return true;
  }
};
function createReactiveObject(target) {
  if (!isObj(target)) return;
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  const exitsProxy = targetMap.get(target);
  if (exitsProxy) {
    return exitsProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  targetMap.set(target, proxy);
  return proxy;
}
function reactive(target) {
  return createReactiveObject(target);
}
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.esm.js.map
