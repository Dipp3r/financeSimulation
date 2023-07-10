import React from "react";
import PropTypes from "prop-types";
import Arrow_left from "@assets/images/Arrow_left.svg";
import "@assets/styles/news.scss";
import Time from "@components/time";
import { WithRouter } from "@components/routingWrapper";

class AssetInfoComp extends React.Component {
  render() {
    return (
      <div id="news">
        <div id="topBar">
          <div id="back">
            <img
              src={Arrow_left}
              alt="back_arrow"
              onClick={() => {
                this.props.navigate("../dashboard");
              }}
            />
          </div>
          <p>Ram Dom Tower</p>
          <Time />
        </div>
        <div id="main">
          <div id="content"></div>
          <div id="fixed"></div>
        </div>
      </div>
    );
  }
}
AssetInfoComp.propTypes = {
  // info: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default WithRouter(AssetInfoComp);
