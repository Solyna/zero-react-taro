import React from "react";
import Taro from "@tarojs/taro";
// import { PageContainer } from "@ant-design/pro-layout";
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
    return (
      <PageContainer>
        <MemoComponent>
          <Content />
        </MemoComponent>
      </PageContainer>
    );
  }
}
