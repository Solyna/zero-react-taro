import { Component } from "react";
import { RegisterApp } from "@/zero/core";
import "./app.less";
import model from "./app.model";

@RegisterApp({ isNeedLogin: false }, model)
class App extends Component {
  // componentDidMount() { }
  // componentDidShow() { }
  // componentDidHide() { }
  // componentDidCatchError() { }
  // this.props.children 是将要会渲染的页面
  // render() {
  //   return this.props.children;
  // }
}

export default App;
