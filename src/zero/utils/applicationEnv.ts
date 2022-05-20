import Taro from "@tarojs/taro";
import { guid } from "./util";

class applicationEnv {
  // info: any;
  readonly clientId: string;
  readonly parentSessionId = guid();
  readonly sessionId = this.parentSessionId;
  readonly onLunchTime = Date.now();

  constructor() {
    let clientId = Taro.getStorageSync("__clientId");
    if (!clientId) {
      clientId = guid();
      Taro.setStorageSync("__clientId", clientId);
    }
    this.clientId = clientId;
    Object.assign(this, process.env.productConfig);
  }
}

export default new applicationEnv();
