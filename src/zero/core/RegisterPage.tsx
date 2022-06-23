import React from "react";
import { connect } from "react-redux";
import Taro from "@tarojs/taro";
import { PageLoading, Error } from "../components";
import { globalActions, globalSelectors } from "../redux";
import { AppConfigContext } from "./ConfigureContext";
import { paramToObject, isEmptyObject } from "../utils";

import { IPageConfig, IModel, IProps } from "../types/zero.d";

export default (pageConfig: IPageConfig, pageModel?: IModel) => (
  WrappedComponent: any
) => {
  const mapStateToProps = (state: any) => {
    const { appStatus } = globalSelectors.app.getState(state);
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    // const eventChannel = current.getOpenerEventChannel();
    let { route: $route, options: $payload } = current;
    return {
      appStatus,
      $payload,
      $route
    };
  };
  class RegisterComponent extends WrappedComponent<IProps, any> {
    constructor(props: IProps) {
      super(props);

      if (!pageModel || isEmptyObject(pageModel)) {
        return;
      }
      const { dispatch } = this.props;
      if (pageModel.initialize) {
        dispatch(pageModel.actions.initState());
      }
      pageModel.runSaga();
    }

    // onLoad
    onLoad(options) {
      if (super.onLaunch) {
        super.onLaunch(options);
      }
      if (!pageModel || isEmptyObject(pageModel)) {
        return;
      }
      if (pageModel.actions.didMount) {
        const { $payload, $route, dispatch } = this.props;
        dispatch(pageModel.actions.onLoad({ $route, $payload, ...options }));
      }
    }

    // // onReady
    // onReady() {}

    // // 对应 onShow
    // componentDidShow() {}

    // // 对应 onHide
    // componentDidHide() {}

    // // 对应 onPullDownRefresh，除了 componentDidShow/componentDidHide 之外，
    // // 所有页面生命周期函数名都与小程序相对应
    // onPullDownRefresh() {}

    // componentDidMount() {
    //   /**
    //    * 前置执行 didMount 方法；
    //    */
    //   if (super.componentDidMount) {
    //     super.componentDidMount();
    //   }
    // }

    render() {
      // const { $hasError } = this.props;
      // if ($hasError) {
      //   return <Error />;
      // }
      return super.render();
    }
  }
  RegisterComponent.contextType = AppConfigContext;

  return connect(mapStateToProps)(
    RegisterComponent as typeof WrappedComponent
  ) as typeof WrappedComponent;
};
