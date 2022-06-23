import React, { useMemo } from "react";
import {
  View,
  Text,
  Label,
  Input,
  Card,
  Divider,
  Slider
} from "@/zero/components";
import Taro from "@tarojs/taro";

const moneyInfo = [
  {
    label: "房屋总额",
    name: "totalAmount",
    placeholder: "请输入房屋总额",
    unit: "万"
  },
  {
    label: "首付比例",
    name: "paymentRatio",
    placeholder: "请输入首付比例",
    unit: "%",
    valueType: "slider",
    sliderRange: {
      min: 1,
      max: 100
    }
  },
  {
    label: "首付金额",
    name: "paymentAmount",
    placeholder: "请输入首付金额",
    unit: "万"
  },
  {
    label: "贷款金额",
    name: "loanAmount",
    placeholder: "请输入贷款金额",
    unit: "万"
  }
];

export default ({ state, setState }) => {
  const { handleMoney } = useMemo(() => {
    const handleMoney = (key, value) => {
      const { totalAmount, paymentRatio, paymentAmount, loanAmount } = state;
      const rel = {
        [key]: value
      };
      switch (key) {
        case "totalAmount":
          if (paymentRatio) {
            rel["paymentRatio"] = paymentRatio;
            rel["paymentAmount"] = Number.parseInt(
              String((value * paymentRatio) / 100),
              10
            );
            rel["loanAmount"] =
              value - Number.parseInt(String((value * paymentRatio) / 100), 10);
            break;
          }
          if (paymentAmount) {
            rel["paymentRatio"] = Number.parseInt(
              String((paymentAmount / value) * 100),
              10
            );
            rel["paymentAmount"] = paymentAmount;
            rel["loanAmount"] = value - paymentAmount;
            break;
          }
          if (loanAmount) {
            rel["paymentRatio"] = Number.parseInt(
              String(((value - loanAmount) / value) * 100),
              10
            );
            rel["paymentAmount"] = value - loanAmount;
            rel["loanAmount"] = loanAmount;
            break;
          }
          break;
        case "paymentRatio":
          if (totalAmount) {
            rel["totalAmount"] = totalAmount;
            rel["paymentAmount"] = Number.parseInt(
              String((totalAmount * value) / 100),
              10
            );
            rel["loanAmount"] =
              totalAmount -
              Number.parseInt(String((totalAmount * value) / 100), 10);
            break;
          }
          if (loanAmount) {
            rel["totalAmount"] = Number.parseInt(
              String(loanAmount / (1 - value / 100)),
              10
            );
            rel["paymentAmount"] =
              Number.parseInt(String(loanAmount / (1 - value / 100)), 10) -
              loanAmount;
            rel["loanAmount"] = loanAmount;
            break;
          }
          if (paymentAmount) {
            rel["totalAmount"] = Number.parseInt(
              String(paymentAmount / (value / 100)),
              10
            );
            rel["paymentAmount"] = paymentAmount;
            rel["loanAmount"] =
              Number.parseInt(String(paymentAmount / (value / 100)), 10) -
              paymentAmount;
            break;
          }

          break;
        case "paymentAmount":
          if (totalAmount) {
            rel["totalAmount"] = totalAmount;
            rel["paymentRatio"] = Number.parseInt(
              String((value / totalAmount) * 100),
              10
            );
            rel["loanAmount"] = totalAmount - value;
            break;
          }
          if (loanAmount) {
            rel["totalAmount"] = loanAmount + value;
            rel["paymentRatio"] = rel["paymentRatio"] = Number.parseInt(
              String((value / (loanAmount + value)) * 100),
              10
            );
            rel["loanAmount"] = loanAmount;
            break;
          }
          if (paymentRatio) {
            rel["totalAmount"] = Number.parseInt(
              String(value / (paymentRatio / 100)),
              10
            );
            rel["paymentRatio"] = paymentRatio;
            rel["loanAmount"] =
              Number.parseInt(String(value / (paymentRatio / 100)), 10) - value;
            break;
          }

          break;
        case "loanAmount":
          if (totalAmount) {
            rel["totalAmount"] = totalAmount;
            rel["paymentRatio"] = Number.parseInt(
              String(((totalAmount - value) / totalAmount) * 100),
              10
            );
            rel["paymentAmount"] = totalAmount - value;
            break;
          }
          if (paymentRatio) {
            rel["totalAmount"] = Number.parseInt(
              String((value / (1 - paymentRatio / 100)) * 100),
              10
            );
            rel["paymentRatio"] = paymentRatio;
            rel["paymentAmount"] =
              Number.parseInt(
                String((value / (1 - paymentRatio / 100)) * 100),
                10
              ) - value;
            break;
          }
          if (paymentAmount) {
            rel["totalAmount"] = paymentAmount + value;
            rel["paymentRatio"] = Number.parseInt(
              String((paymentAmount / (paymentAmount + value)) * 100),
              10
            );
            rel["paymentAmount"] = paymentAmount;
            break;
          }
          break;
      }
      setState({ ...rel });
    };

    return { handleMoney };
  }, [state]);

  return (
    <Card>
      {moneyInfo.map((item, index) => {
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
              {item.valueType && item.valueType === "slider" ? (
                <Text
                  style={{
                    flex: "auto",
                    textAlign: "right"
                  }}
                >
                  {state[item.name]}
                </Text>
              ) : (
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
                    handleMoney(item.name, value);
                  }}
                  value={state[item.name]}
                  placeholder={item.placeholder}
                />
              )}
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
                onChange={({ detail }) => {
                  const { value } = detail;
                  handleMoney(item.name, value);
                }}
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
            {index === moneyInfo.length - 1 ? "" : <Divider />}
          </React.Fragment>
        );
      })}
    </Card>
  );
};
