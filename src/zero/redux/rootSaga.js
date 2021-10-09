/**
 * takeEvery 多个实例同时启动
 * takeLatest 只执行这个任务是最后被启动的那个，之前的这个任务会被自动取消
 * put
 * call  call 同样支持调用对象方法，你可以使用以下形式，为调用的函数提供一个 this 上下文
 *    yield call([obj, obj.method], arg1, arg2, ...) // 如同 obj.method(arg1, arg2 ...)
 * apply 提供了另外一种调用的方式
 *    yield apply(obj, obj.method, [arg1, arg2, ...])
 * cps 表示的是延续传递风格
 *    const content = yield cps(readFile, '/path/to/file')
 * all 自动执行
 */
import {
  all,
  take,
  put,
  fork,
  call,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects'

import staticActions from './rootAction'
import { getEnv } from './rootSelector'
import { guid } from '../utils'

const initEnv = function* () {
  const env = yield select(getEnv)
  let clientId = null // Zero.getStorageSync('__clientId')
  if (!clientId) {
    clientId = guid()
    // Zero.setStorageSync('__clientId', clientId)
  }
  const parentSessionId = guid()
  const sessionId = parentSessionId
  const onLunchTime = Date.now()

  Object.assign(
    env,
    {
      parentSessionId,
      sessionId,
      onLunchTime,
      __clientId: clientId,
      version: process.env.VERSION,
      platformType: process.env.application,
      theme: 'A',
    },
    process.env.productConfig
  )
  /**
   * 设置axios拦截器
   */
  // yield call(setAxiosBase, env)
  yield put(staticActions.env.setEnv({ ...env }))
  // const themeInfo = themes[env.theme]
  // Object.keys(themeInfo).forEach((key) => {
  //   document.documentElement.style.setProperty(key, themeInfo[key]);
  // });
}

const initSystem = function* () {}

const rootLunch = function* () {
  yield call(checkLogin)
  yield put(staticActions.env.setEnv({ status: true }))
}

const checkLogin = function* () {
  // try {
  //   const user = yield call(Zero.post, `gateway/user/currentUser`)
  //   user['isLogin'] = false
  //   if (user && user.user && user.user.mobile) {
  //     user['isLogin'] = true
  //   }
  //   user['mobile'] = user.user && user.user.mobile
  //   yield call(Zero.setStorageSync, 'user', user, Infinity)
  //   yield put(staticActions.user.setUser(user))
  //   yield put(staticActions.app.getDefaultCar())
  // } catch (error) {
  //   yield call(Zero.removeStorageSync, 'user')
  //   yield put(staticActions.user.setUser({ isLogin: false }))
  // }
}

export default function* staticSagas() {
  /**
   * 系统信息初始化
   */
  yield all([initSystem(), initEnv()])
  yield all([rootLunch()])
}
