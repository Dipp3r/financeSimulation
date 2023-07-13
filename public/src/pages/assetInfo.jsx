import React from "react";
import PropTypes from "prop-types";
import Arrow_left from "@assets/images/Arrow_left.svg";
import "@assets/styles/news.scss";
import Time from "@components/time";

class AssetInfoComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
    };
  }
  componentDidMount() {
    this.setState(JSON.parse(localStorage.getItem("asset")));
  }
  render() {
    return (
      <div id="news">
        <div id="topBar">
          <div id="back">
            <img
              src={Arrow_left}
              alt="back_arrow"
              onClick={() => {
                this.props.toggleMainDisplay("dashboard");
              }}
            />
          </div>
          <p className="pageTitle">{this.state.name}</p>
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
  toggleMainDisplay: PropTypes.func.isRequired,
};

export default AssetInfoComp;
