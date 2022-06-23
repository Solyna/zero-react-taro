import React, { useMemo, useState } from "react";
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

const businessInfo = [
  {
    label: "商贷金额",
    name: "businessLoan",
    placeholder: "请输入商贷金额",
    unit: "万",
    onInput: (value, state, setState) => {
      if (state["loanAmount"]) {
        setState({
          accumulationLoan: state["loanAmount"] - Number(value),
          businessLoan: value
        });
      } else {
        setState({
          businessLoan: value
        });
      }
    }
  },
  {
    label: "商贷年限",
    name: "businessYears",
    placeholder: "请输入商贷年限",
    unit: "年",
    valueType: "slider",
    sliderRange: {
      min: 1,
      max: 30
    }
  },
  {
    label: "利率方式",
    name: "businessRatioType",
    placeholder: "请选择利率方式",
    unit: ">",
    valueType: "selector",
    valueEnum: {
      "4.65": { text: "新版LPR" },
      "4.9": { text: "旧版基准利率" }
    },
    onChange: (currentValue, item, state, setState) => {
      if (currentValue === "4.65") {
        setState({
          businessRatioType: currentValue,
          isLPR: true,
          businessLPR: currentValue,
          businessRatio: currentValue + Number(state["businessBase"] || 0)
        });
      }
      if (currentValue === "4.9") {
        setState({
          businessRatioType: currentValue,
          isLPR: false,
          businessRatio: currentValue
        });
      }
    }
  },
  {
    label: "LPR",
    name: "businessLPR",
    placeholder: "请输入LPR",
    disabled: true,
    unit: "%"
  },
  {
    label: "基点",
    name: "businessBase",
    placeholder: "请输入基点",
    unit: "%",
    onInput: (value, state, setState) => {
      setState({
        businessRatio:
          Number.parseInt(
            String(state["businessLPR"] * 100 + Number(value)),
            10
          ) / 100,
        businessBase: value
      });
    }
  },
  {
    label: "商贷利率",
    name: "businessRatio",
    placeholder: "请输入商贷利率",
    disabled: true,
    unit: "%"
  }
];

export default ({ state, setState }) => {
  if (state["activeKey"] == 3) {
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
              name={item.name}
              value={value}
              range={range}
              onChange={({ detail: { value } }) => {
                if (item.onChange) {
                  item.onChange(
                    items[value]["value"],
                    items[value],
                    state,
                    setState
                  );
                } else {
                  setState({
                    [item.name]: items[value]["value"]
                  });
                }
              }}
            >
              <View class="picker">{items[value]["text"]}</View>
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
              disabled={Reflect.has(item, "disabled") ? item.disabled : false}
              name={item.name}
              onInput={({ detail }) => {
                const { value } = detail;
                if (item.onInput) {
                  item.onInput(value, state, setState);
                } else {
                  setState({
                    [item.name]: value
                  });
                }
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
      {businessInfo.map((item, index) => {
        if (
          ["businessLPR", "businessBase"].includes(item.name) &&
          !state["isLPR"]
        ) {
          return null;
        }
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
            {index === businessInfo.length - 1 ? "" : <Divider />}
          </React.Fragment>
        );
      })}
    </Card>
  );
};
