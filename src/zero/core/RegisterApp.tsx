// import React from "react";
import Taro from "@tarojs/taro";
import { Provider } from "react-redux";
import { store as $store } from "../redux";
// import { View } from "../components";
// import { PageLoading } from "../components"; // Exception
import ConfigureContext from "./ConfigureContext";
// import useGlobalError from "./useGlobalError";
import type { IConfig, IModel } from "../types/zero";

// let unsubscribe: Function;
/**
 * 1. 初始化store
 * 2. 初始化路由
 * 3. 初始化layout
 * 4. 定义项目入口
 * 5. 添加全局错误监听
 */
export default (appConfig: IConfig, appModel: IModel) =>
  (WrappedComponent: any) => {
    class RegisterComponent extends WrappedComponent {
      constructor(props: any) {
        super(props);
        this.state = {
          appStatus: "loading",
          errorInfo: {},
        };
        /**
         * 运行app中 saga
         */
        appModel.initialize && $store.dispatch(appModel.actions.initState());
      }

      // 对应 onLaunch
      onLaunch(options) {
        console.log("onLaunch");

        const { path: $route, query: $payload } = options;
        $store.dispatch(
          appModel.actions.onLunch({ $route, $payload, ...options })
        );

        if (super.onLaunch) {
          super.onLaunch(options);
        }
      }
      // 对应 onShow
      componentDidShow(options) {
        if (appModel.actions.onShow) {
          const { path: $route, query: $payload } = options;
          $store.dispatch(
            appModel.actions.onShow({ $route, $payload, ...options })
          );
        }

        if (super.componentDidShow) {
          super.componentDidShow(options);
        }
      }

      // 程序要打开的页面不存在时触发
      onPageNotFound(options) {
        const { path, query, isEntryPage } = options;
        console.log(path, query, isEntryPage);
      }

      // 对应 onHide
      // componentDidHide() {}

      // componentDidMount() {
      //   // useGlobalError();
      //   unsubscribe = $store.subscribe(() => {
      //     const {
      //       app: { appStatus, errorInfo },
      //     } = $store.getState();
      //     if (appStatus && appStatus !== "loading") {
      //       this.setState({
      //         appStatus,
      //         errorInfo,
      //       });
      //     }
      //     if (appStatus === "success") {
      //       unsubscribe();
      //     }
      //   });
      //   if (super.componentDidMount) {
      //     super.componentDidMount();
      //   }
      // }

      // componentWillUnmount() {
      //   unsubscribe && unsubscribe();
      //   if (super.componentWillUnmount) {
      //     super.componentWillUnmount();
      //   }
      // }

      // renderContent() {
      //   const { appStatus, errorInfo } = this.state;

      //   switch (appStatus) {
      //     case "loading":
      //       return (
      //         <View
      //           style={{
      //             height: "100vh",
      //           }}
      //         >
      //           <PageLoading />
      //         </View>
      //       );
      //     case "error":
      //       return (
      //         <View
      //           style={{
      //             height: "100vh",
      //           }}
      //         >
      //           {/* <Exception {...errorInfo} /> */}
      //         </View>
      //       );
      //     default:
      //       return this.props.children;
      //   }
      // }

      render() {
        // this.props.children 是将要会渲染的页面
        return (
          <Provider store={$store}>
            <ConfigureContext appConfig={appConfig}>
              {this.props.children}
            </ConfigureContext>
          </Provider>
        );
      }
    }
    return RegisterComponent as typeof WrappedComponent;
  };
