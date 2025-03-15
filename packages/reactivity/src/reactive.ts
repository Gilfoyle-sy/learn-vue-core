import { isObj } from '@vuez/shared'
import { mutableHandlers, ReactiveFlags } from './baseHandler'

// 使用弱引用，缓存所有的代理对象，防止重复代理
const reactiveMap = new WeakMap()

function createReactiveObject(target) {
  // 判断参数是否是一个对象
  if (!isObj(target)) {
    return console.error('reactive的参数必须是一个对象')
  }

  // 判断是否是响应式对象
  if (target[ReactiveFlags.IS_REACTIVE]) {
    console.error('该对象已经是响应式对象')
    return target
  }

  // 检测缓存,如果已经存在直接返回
  const exitsProxy = reactiveMap.get(target)
  if (exitsProxy) {
    console.warn('该已经被代理过，直接从缓存中取')
    return exitsProxy
  }

  let proxy = new Proxy(target, mutableHandlers)

  // 添加到代理缓存
  reactiveMap.set(target, proxy)

  return proxy
}

export function reactive(target) {
  return createReactiveObject(target)
}
