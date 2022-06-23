import React, { useMemo } from "react";
import {
  View,
  Text,
  Label,
  Input,
  Card,
  Divider,
  Slider,
  Picker
} from "@/zero/components";
import Taro from "@tarojs/taro";

const accumulationInfo = [
  {
    label: "公积金金额",
    name: "accumulationLoan",
    placeholder: "请输入公积金金额",
    unit: "万"
  },
  {
    label: "公积金年限",
    name: "accumulationYears",
    placeholder: "请输入公积金年限",
    unit: "年",
    valueType: "slider",
    sliderRange: {
      min: 1,
      max: 30
    }
  },
  {
    label: "公积金利率",
    name: "accumulationRatio",
    placeholder: "请输入公积金利率",
    unit: "%",
    valueType: "selector",
    valueEnum: {
      "3.25": { text: "最新基准利率（3.25%）" },
      "3.575": { text: "最新基准利率上浮10%（3.575%）" }
    }
    // sliderRange: {
    //   min: 1,
    //   max: 100
    // }
  }
];

export default ({ state, setState }) => {
  if (state["activeKey"] == 2) {
    return null;
  }
  const { getA } = useMemo(() => {
    const getA = (item, state, setState) => {
      switch (item.valueType) {
        case "slider":
          return (
            <Text
              style={{
                flex: "auto",
                textAlign: "right"
              }}
            >
              {state[item.name]}
            </Text>
          );
        case "selector":
          const items: any = [];
          const range: any = [];
          let value = 0;
          let count = 0;
          for (let i in item.valueEnum) {
            if (String(state[item.name]) === String(i)) {
              value = count;
            }
            count++;
            items.push({ value: i, ...item.valueEnum[i] });
            range.push((item as any).valueEnum[i]["text"]);
          }

          return (
            <Picker
              bindchange="bindPickerChange"
              name={item.name}
              value={value}
              range={range}
              onChange={({ detail: { value } }) => {
                setState({
                  [item.name]: items[value]["value"]
                });
              }}
            >
              <View class="picker">{state[item.name]}</View>
            </Picker>
          );
        default:
          return (
            <Input
              style={{
                flex: "auto",
                textAlign: "right"
              }}
              placeholder-style="text-align: right;"
              type="number"
              name={item.name}
              onInput={({ detail }) => {
                const { value } = detail;
                // handleMoney(item.name, value);
                setState({
                  [item.name]: value
                });
              }}
              value={state[item.name]}
              placeholder={item.placeholder}
            />
          );
      }
    };

    return { getA };
  }, []);
  return (
    <Card>
      {accumulationInfo.map((item, index) => {
        return (
          <React.Fragment>
            <View
              style={{
                boxSizing: "border-box",
                display: "inline-flex",
                width: "100%",
                padding: "3px 10px"
              }}
            >
              <Label
                style={{
                  flex: "200px"
                }}
              >
                {item.label}
              </Label>
              {getA(item, state, setState)}
              <Text
                style={{
                  flex: "5px",
                  paddingLeft: "2px"
                }}
              >
                {item.unit}
              </Text>
            </View>
            {item.valueType && item.valueType === "slider" ? (
              <Slider
                {...item.sliderRange}
                // onChange={({ detail }) => {
                //   const { value } = detail;
                //   handleMoney(item.name, value);
                // }}
                name={item.name}
                value={state[item.name]}
                onChanging={({ detail }) => {
                  const { value } = detail;
                  setState({
                    [item.name]: value
                  });
                }}
                show-value
              />
            ) : (
              ""
            )}
            {index === accumulationInfo.length - 1 ? "" : <Divider />}
          </React.Fragment>
        );
      })}
    </Card>
  );
};
