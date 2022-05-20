import React from "react";

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
