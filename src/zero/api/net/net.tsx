/**
 * http://axios-js.com/zh-cn/docs/index.html
 * https://www.kancloud.cn/yunye/axios/234845#handling-errors
 * https://github.com/axios/axios#axios-api
 *
 * https://blog.csdn.net/Gomeer/article/details/89030650
 * https://segmentfault.com/a/1190000016457844
 * https://blog.csdn.net/qiushisoftware/article/details/80158593
 */
import Taro from "@tarojs/taro";
import { cloneDeep } from "../../utils";

type Option = Taro.request.Option;

export type RequestOptions = {
  path?: string;
  disableToken?: boolean;
  showLoading?: boolean;
  useMock?: boolean;
} & Partial<Option>;

export interface RequestResponse<T> {
  code: string;
  msg: string;
  data: T;
  [key: string]: any;
}
/**
 * 正在进行中的请求
 */
const pending: Record<string, boolean> = {};
/**
 * 执行取消重复请求操作
 * @param {*} key
 * @param {*} isRequest
 */

/**
 * config: 请求数据  Partial<request.Option>
 * isReuest: 请求拦截器中 config.url = '/users', 响应拦截器中 config.url = 'http://localhost:3000/users'，所以加上一个标识来计算请求的全路径
 */
const getRequestIdentify = (requestParams: RequestOptions) => {
  const url: string = requestParams.url || "";
  const method: string = requestParams.method || "";
  let data: any = {};
  return encodeURIComponent(url + method + JSON.stringify(data));
};

type Handler<V> = {
  fulfilled: (value: V) => V | Promise<V>;
  rejected?: (error: any) => any;
};
class InterceptorManager<V> {
  public handlers: Handler<V>[] = [];

  /**
   * 增加请求或返回的拦截器，多个拦截器按顺序执行
   * @param fulfilled 拦截器处理的函数
   * @param rejected Promise中失败的回调，一般只用在reponse拦截器中
   */
  public use(fulfilled: (value: V) => V, rejected?: any) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  }
}

class Net {
  /**
   * 请求的拦截器配置
   */
  interceptors: {
    request: InterceptorManager<any>;
    response: InterceptorManager<any>;
  };

  constructor() {
    Taro.addInterceptor(this.defaultInterceptor);
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  /**
   * 请求拦截器，如果相同请求已经在进行，则取消后续相同请求
   * 且只对传入参数进行计算，公共参数以及 __requestId 不能进入计算逻辑
   * @param {*} config
   * @returns
   */
  defaultInterceptor = async chain => {
    let requestParams = chain.requestParams;
    const requestIdentify = getRequestIdentify(requestParams);
    if (pending[requestIdentify]) {
      return Promise.reject({ code: "410", msg: "取消重复请求" });
    }
    const startTime = Date.now();
    pending[requestIdentify] = true;
    /**
     * 执行request - request拦截器
     *
     */
    // 加入拦截器机制，请求拦截可以修改请求的配置，注：是在生成taro的request参数之前
    let promise: Promise<RequestOptions> = Promise.resolve(requestParams);
    for (let interceptor of this.interceptors.request.handlers) {
      requestParams = await promise.then<any, any>(
        interceptor.fulfilled,
        interceptor.fulfilled
      );
    }

    return chain.proceed(requestParams).then(async resp => {
      delete pending[requestIdentify];
      const { statusCode } = resp;
      if (statusCode !== 200) {
        return this.responseErrorHandler(resp);
      }
      const { data } = resp;
      const respPromise = Promise.resolve(data);
      let newData = cloneDeep(data);
      let errorData;
      for (let interceptor of this.interceptors.response.handlers) {
        try {
          newData = await respPromise.then<any, any>(
            interceptor.fulfilled,
            interceptor.rejected
          );
        } catch (error) {
          errorData = error;
        }
      }
      const costTime = Date.now() - startTime;
      if (process.env.NODE_ENV === "development") {
        this.consoleGroup(`--- 接口请求 ${requestParams.url} ---`, {
          "request：": requestParams,
          "请求地址：": requestParams.baseURL,
          "接口名称：": requestParams.url,
          "请求方法：": requestParams.method,
          "请求数据：": requestParams.data,
          "返回数据：": resp.data,
          "请求耗时：": `${costTime}ms`
        });
      }
      if (errorData) {
        return { ...errorData, costTime };
      }
      return { ...newData, costTime };
    });
  };

  consoleGroup = (title: string, msgs: Record<string, any>) => {
    if (msgs) {
      console.groupCollapsed(title);
      for (let i in msgs) {
        console.log(i, msgs[i]);
      }
      console.groupEnd();
    }
  };

  // 网络异常拦截器
  responseErrorHandler = (resp: any) => {
    const { statusCode, errMsg } = resp || {};
    if (statusCode) {
      let msg;
      switch (statusCode) {
        case 400:
          msg = "错误请求";
          break;
        case 401:
          msg = "未授权，请重新登录";
          break;
        case 403:
          msg = "拒绝访问";
          break;
        case 404:
          msg = "请求错误,未找到该资源";
          break;
        case 405:
          msg = "请求方法未允许";
          break;
        case 408:
          msg = "请求超时";
          break;
        case 500:
          msg = "服务器端出错";
          break;
        case 501:
          msg = "网络未实现";
          break;
        case 502:
          msg = "网络错误";
          break;
        case 503:
          msg = "服务不可用";
          break;
        case 504:
          msg = "网络超时";
          break;
        case 505:
          msg = "http版本不支持该请求";
          break;
        default:
          msg = `连接错误${statusCode}`;
      }
      return Promise.reject({
        msg: `${errMsg}；${msg}`,
        code: statusCode
      });
    }
    return Promise.reject({
      msg: `${errMsg}`,
      code: statusCode
    });
  };

  async request<R = any, P = any>(options: RequestOptions) {
    // const requestIdentify = getRequestIdentify(options);
    const requestTask = Taro.request<RequestResponse<R>, P>(
      options as Taro.request.Option
    );
    const c = requestTask as Taro.RequestTask<RequestResponse<R>>;
    // pending[requestIdentify] = c.abort;
    // removePending(requestIdentify);
    return requestTask;
  }
}

const net = new Net();
const HttpClient = net;
export { net, HttpClient };
