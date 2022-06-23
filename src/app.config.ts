export default {
  pages: ["pages/index/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  subPackages: [
    {
      root: "pages/common/",
      pages: ["outer/index", "land/index"]
    },
    {
      root: "pages/calculator/",
      pages: ["house/index/index"]
    }
  ]
};
