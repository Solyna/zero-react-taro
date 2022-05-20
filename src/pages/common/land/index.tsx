import React from "react";
import Taro from "@tarojs/taro";
import {WebView} from "@/zero/components"

const Index = () => {
  console.log("Index");


  return (
    <WebView src="https://m.baidu.com/">
    </WebView>
  );
};

export default Index;
