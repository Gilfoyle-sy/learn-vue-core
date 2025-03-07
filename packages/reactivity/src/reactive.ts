import { isObj } from '@vuez/shared'

const targetMap = new WeakMap()

enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
  },
  set(target, key, value, receiver) {
    return true
  }
}

function createReactiveObject(target) {
  if (!isObj(target)) return

  // 检测是否已经是响应式对象,如果是直接返回
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 检测缓存,如果已经存在直接返回
  const exitsProxy = targetMap.get(target)
  if (exitsProxy) {
    return exitsProxy
  }

  let proxy = new Proxy(target, mutableHandlers)
  targetMap.set(target, proxy)

  return proxy
}

export function reactive(target) {
  return createReactiveObject(target)
}
