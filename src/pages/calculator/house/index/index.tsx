import React from "react";
import Taro from "@tarojs/taro";
import { RegisterPage } from "@/zero/core";
import { MemoComponent, PageContainer } from "@/zero/components";
import type { IProps } from "@/zero/types/zero";
import "./index.less";

import Content from "./components/Content";

@RegisterPage({ pageId: "1000" })
export default class extends React.PureComponent<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  render(): React.ReactNode {
    const cacheState = Taro.getStorageSync("house-state") || null;
    console.log('cacheState:::', cacheState);
    
    return (
      <PageContainer>
        <MemoComponent>
          <Content cacheState={cacheState} />
        </MemoComponent>
      </PageContainer>
    );
  }
}
