import { activeEffect, trackEffect, triggerEffect } from './effect'

const targetMap = new WeakMap() // 存放依赖手机

export const createDep = (key, cleanUp) => {
  const dep = new Map() as any
  dep.cleanup = cleanUp
  dep.keyName = key
  return dep
}

export function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)

    if (!depsMap) {
      // 新增一个Map
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = createDep(key, () => depsMap.delete(key))))
    }

    trackEffect(activeEffect, dep)
  }
}

export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  let dep = depsMap.get(key)
  if (dep) {
    triggerEffect(dep)
  }
}
