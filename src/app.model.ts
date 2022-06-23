import { createModel } from "@/zero/redux";
// import { put, call, select } from "redux-saga/effects";
import type { ISagas } from "@/zero/types/zero";
import {HttpClient} from "@/zero/api"
import initHttpClient from "./initHttpClient"
type ISagaPayload = {
  payload: any;
};

const model = createModel({
  // model名称，view层用于提取state的key，需要保证唯一
  name: "app",
  isGlobal: true,
  // 初始state状态
  state: {
    appStatus: "loading",
  },
  reducers: {},
  sagas: {
    *onLunch({}: ISagas, { payload }: ISagaPayload) {
      initHttpClient();
      const data = yield HttpClient.get('getUserInfo',{
        data: {a: 1},
        responseType: "text"
      });

      console.log("micro lunch,", data);
    },
    *onShow({}: ISagas, { payload }: ISagaPayload) {
      console.log(" micro Show,", payload);
    },
  },
});

export default model;
