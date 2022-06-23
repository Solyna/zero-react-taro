import React, { useMemo } from "react";
import {
  View,
  Text,
  Label,
  Input,
  Form,
  Button,
  Card,
  Divider,
  Tabs,
  Slider
} from "@/zero/components";
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
import { guid } from "@/zero/utils";
import Taro, { useReady, useRouter } from "@tarojs/taro";
import { useMergeState } from "@/zero/api";

import Money from "./Money";
import Accumulation from "./Accumulation";
import Business from "./Business";

const TabPane = Tabs;

const Index = () => {
  const [state, setState] = useMergeState({
    paymentRatio: 35,
    accumulationYears: 30,
    businessYears: 30,
    accumulationRatio: 3.575,
    activeKey: 1
  });
  console.log("---->>>>>", state);

  // activeKey
  // defaultActiveKey
  // onTabClick
  // onChange
  const formSubmit = e => {
    console.log(e);
  };

  const formReset = e => {
    console.log(e);
  };

  return (
    <Form onSubmit={formSubmit} onReset={formReset}>
      <Card>
        <Tabs
          onTabClick={key => {
            setState({ activeKey: key });
          }}
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
      <View class="btn-area">
        <Button style="margin: 30rpx 0" type="primary" formType="submit">
          Submit
        </Button>
        <Button style="margin: 30rpx 0" formType="reset">
          Reset
        </Button>
      </View>
    </Form>
  );
};

export default Index;
