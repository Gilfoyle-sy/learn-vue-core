export let activeEffect

class ReactiveEffect {
  public active = true // 默认创建的是响应式函数
  deps = []
  _trackId = 0 // 用来记录effect被执行了几次
  _depsLength = 0

  /**
   *
   * @param fn effect传入的函数
   * @param scheduler 调度函数,每次fn依赖的响应式数据更新时,会调用scheduler
   */
  constructor(public fn, public scheduler) {}

  run() {
    // 如果active为false,则直接执行fn
    if (!this.active) {
      return this.fn()
    }

    let lastEffect = activeEffect
    try {
      activeEffect = this
      preCleanEffect(this)
      return this.fn()
    } finally {
      activeEffect = lastEffect
    }
  }
}

function preCleanEffect(effect) {
  effect._depsLength = 0
  effect._trackId++
}

export function effect(fn, options?) {
  // 创建一个响应式函数
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })

  _effect.run()
}

export function trackEffect(effect, dep) {
  console.log(dep.get(effect), effect._trackId)

  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId)

    let oldDep = effect.deps[effect._depsLength]
    if (oldDep !== dep) {
      if (oldDep) {
        oldDep.delete(effect)
      }
      effect.deps[effect._depsLength++] = dep
    } else {
      effect._depsLength++
    }
  }
}

export function triggerEffect(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler()
    }
  }
}
