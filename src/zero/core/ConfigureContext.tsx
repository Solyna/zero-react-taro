import React from "react";
import Taro from "@tarojs/taro";

export const AppConfigContext = React.createContext({});
AppConfigContext.displayName = "AppConfigContext";

export default (props: any) => {
  const { children, appConfig } = props;
  return (
    <AppConfigContext.Provider value={appConfig}>
      {children}
    </AppConfigContext.Provider>
  );
};
