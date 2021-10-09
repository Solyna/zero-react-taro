import { connect } from "react-redux";
import Content from "../components/Content";

export default connect(
  (state, { $model, $globalSelectors }) => {
    return {};
  },
  (dispatch, { $model, $globalActions }) => {
    return {
      goTo (){
        wx.navigateTo({
          url: '/pages/index1/index',
        })
      }
    };
  }
)(Content);
