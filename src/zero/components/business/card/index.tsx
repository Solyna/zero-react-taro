import Taro from "@tarojs/taro";
import { View } from "../../basic";

export default props => {
  return (
    <View
      style={{
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        borderRadius: "3px",
        marginBottom: "10px"
      }}
    >
      <View style={{ padding: "10px" }}>{props.children}</View>
    </View>
  );
};
