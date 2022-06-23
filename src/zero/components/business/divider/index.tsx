import Taro from "@tarojs/taro";
import { View } from "../../basic";

export default () => {
  return (
    <View
      style={{
        margin: "10px",
        borderTop: "1px solid rgba(0,0,0,.06)",
        height: "0px",
        width: "auto",
        boxSizing: "border-box",
        clear: "both"
      }}
    ></View>
  );
};
