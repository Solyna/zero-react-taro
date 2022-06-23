import Taro from "@tarojs/taro";
import { View } from "../../basic";

export default props => {
  return (
    <View
      style={{ width: "100vw", padding: "5px 10px", boxSizing: "border-box" }}
    >
      {props.children}
    </View>
  );
};
