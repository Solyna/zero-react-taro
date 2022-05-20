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
    appStatus: "",
  },
  reducers: {},
  sagas: {
    *onLunch({}: ISagas, { payload }: ISagaPayload) {
      initHttpClient();
      const {res } = yield HttpClient.request({
        url: 'getUserInfo',
        data: {a: 1},
        method: "GET",
        dataType: "json",
        responseType: "text"
      });
      console.log('>>>>>>>', res);
      
      HttpClient.request({
        url: 'getUserInfo',
        data: {a: 1},
        method: "GET",
        dataType: "json",
        responseType: "text"
      }).then((res) => {
        console.log("http::", res);
        
      }).catch((e) => {
        console.log("http:error>>>:", e);
      });
      console.log("micro lunch,", payload);
    },
    *onShow({}: ISagas, { payload }: ISagaPayload) {
      console.log(" micro Show,", payload);
    },
  },
});

export default model;
