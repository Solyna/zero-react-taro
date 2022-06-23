import Taro from "@tarojs/taro";
import { useState, useEffect, useMemo } from "react";
import { isArray } from "../../../utils";
import { View, Text } from "../../basic";
import { useMergeState } from "../../../api";
import "./index.less";

type ITabPaneProps = {
  tab: string;
  key: any;
  children: React.ReactElement;
};

const Tabs = props => {
  const { children, onTabClick, defaultActiveKey } = props;
  const [state, setState] = useMergeState({
    tabPaneElements: {},
    childrenArr: isArray(children) ? children : [children],
    activeKey: defaultActiveKey
  });
  const { tabPaneElements, childrenArr, activeKey } = state;

  useEffect(() => {
    const tabPaneElements = {};
    childrenArr.forEach((item, index) => {
      if (!defaultActiveKey && index === 0) {
        setState({
          activeKey: item.key
        });
      }
      tabPaneElements[item.key] = item.props.children;
    });
    setState({
      tabPaneElements: tabPaneElements
    });
  }, [childrenArr, defaultActiveKey]);

  const { handleClick } = useMemo(() => {
    const handleClick = key => {
      setState({
        activeKey: key
      });
      onTabClick && onTabClick(key);
    };
    return { handleClick };
  }, [onTabClick, tabPaneElements, activeKey]);

  return (
    <View className="tabs">
      <View style={{ display: "flex" }}>
        {childrenArr.map(item => {
          return (
            <View
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center"
              }}
              onClick={() => {
                handleClick(item.key);
              }}
            >
              <View
                className={activeKey == item.key ? "tab active-tab" : "tab"}
              >
                <Text>{item.props.tab}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ width: "100%" }}>{tabPaneElements[activeKey]}</View>
    </View>
  );
};

const TabPane = (props: ITabPaneProps) => {
  const { children } = props;
  return { children };
};

Tabs.TabPane = TabPane;

export default Tabs;
