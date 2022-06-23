// import React, { useMemo } from "react";
import { View, Form, Button, Card, Tabs } from "@/zero/components";
// import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
// import { guid } from "@/zero/utils";
import Taro, { useReady, useRouter } from "@tarojs/taro";
import { useMergeState } from "@/zero/api";

import Money from "./Money";
import Accumulation from "./Accumulation";
import Business from "./Business";
import { useMemo } from "react";

const TabPane = Tabs;
const defaultState = {
  accumulationLoan: null,
  businessBase: null,
  businessLoan: null,
  loanAmount: null,
  paymentAmount: null,
  totalAmount: null,

  paymentRatio: 35,
  accumulationYears: 30,
  businessYears: 30,
  accumulationRatio: 3.575,
  businessRatioType: 4.65,
  businessLPR: 4.65,
  businessRatio: 4.65,
  activeKey: 1,
  isLPR: true
};
const Index = ({ cacheState }) => {
  const [state, setState] = useMergeState(cacheState || defaultState);
  console.log("---->>>>>", cacheState, state);

  const { formReset, formSubmit } = useMemo(() => {
    const formSubmit = e => {
      console.log(e);
    };

    const formReset = e => {
      setState(defaultState);
    };

    return { formSubmit, formReset };
  }, [state, setState]);

  Taro.setStorageSync("house-state", state);

  return (
    <Form onSubmit={formSubmit} onReset={formReset}>
      <Card>
        <Tabs
          onTabClick={key => {
            setState({ activeKey: key });
          }}
          activeKey={state["activeKey"]}
          defaultActiveKey={state["activeKey"]}
        >
          <TabPane tab="组合贷" key={1}></TabPane>
          <TabPane tab="商业贷" key={2}></TabPane>
          <TabPane tab="公积金贷" key={3}></TabPane>
        </Tabs>
      </Card>

      <View>
        <Money state={state} setState={setState} />
        <Accumulation state={state} setState={setState} />
        <Business state={state} setState={setState} />
      </View>
      <View class="btn-area" style="display: flex;">
        <Button
          style="margin: 30rpx 20rpx; flex: 1;"
          type="primary"
          formType="submit"
        >
          开始计算
        </Button>
        <Button style="margin: 30rpx 20rpx; flex: 1;" formType="reset">
          重置
        </Button>
      </View>
    </Form>
  );
};

export default Index;
