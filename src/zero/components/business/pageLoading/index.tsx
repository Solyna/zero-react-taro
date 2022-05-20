import Taro from "@tarojs/taro";
import { View } from "../../basic";
import "./index.less";

export default () => {
  return (
    <View className="page-loading">
      加载中....
      {/* <View size='large' className='page-loading-spin' /> */}
    </View>
  );
};
