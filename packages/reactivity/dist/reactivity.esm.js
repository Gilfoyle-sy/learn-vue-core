// packages/reactivity/src/effect.ts
var activeEffect;
var ReactiveEffect = class {
  /**
   *
   * @param fn effect传入的函数
   * @param scheduler 调度函数,每次fn依赖的响应式数据更新时,会调用scheduler
   */
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    // 默认创建的是响应式函数
    this.deps = [];
    this._trackId = 0;
    // 用来记录effect被执行了几次
    this._depsLength = 0;
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let lastEffect = activeEffect;
    try {
      activeEffect = this;
      preCleanEffect(this);
      return this.fn();
    } finally {
      activeEffect = lastEffect;
    }
  }
};
function preCleanEffect(effect2) {
  effect2._depsLength = 0;
  effect2._trackId++;
}
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
}
function trackEffect(effect2, dep) {
  console.log(dep.get(effect2), effect2._trackId);
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    let oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        oldDep.delete(effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
function triggerEffect(dep) {
  for (const effect2 of dep.keys()) {
    if (effect2.scheduler) {
      effect2.scheduler();
    }
  }
}

// packages/shared/src/index.ts
function isObj(val) {
  return typeof val === "object" && val !== null;
}

// packages/reactivity/src/reactiveEffect.ts
var targetMap = /* @__PURE__ */ new WeakMap();
var createDep = (key, cleanUp) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanUp;
  dep.keyName = key;
  return dep;
};
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap = /* @__PURE__ */ new Map();
      targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(key, () => depsMap.delete(key)));
    }
    trackEffect(activeEffect, dep);
  }
}
function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  let dep = depsMap.get(key);
  if (dep) {
    triggerEffect(dep);
  }
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    let result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return result;
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function createReactiveObject(target) {
  if (!isObj(target)) {
    return console.error("reactive\u7684\u53C2\u6570\u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61");
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    console.error("\u8BE5\u5BF9\u8C61\u5DF2\u7ECF\u662F\u54CD\u5E94\u5F0F\u5BF9\u8C61");
    return target;
  }
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) {
    console.warn("\u8BE5\u5DF2\u7ECF\u88AB\u4EE3\u7406\u8FC7\uFF0C\u76F4\u63A5\u4ECE\u7F13\u5B58\u4E2D\u53D6");
    return exitsProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
function reactive(target) {
  return createReactiveObject(target);
}
export {
  activeEffect,
  effect,
  reactive,
  trackEffect,
  triggerEffect
};
//# sourceMappingURL=reactivity.esm.js.map
