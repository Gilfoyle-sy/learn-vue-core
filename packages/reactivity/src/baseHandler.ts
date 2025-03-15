import { track, trigger } from './reactiveEffect'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    // 如果是响应式对象，则返回true
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    // 收集依赖
    track(target, key)

    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const oldValue = target[key]

    let result = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      // 触发依赖
      trigger(target, key, value, oldValue)
    }

    return result
  }
}
