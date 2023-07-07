import React from "react";
import PropTypes from "prop-types";
import Arrow_left from "@assets/images/Arrow_left.svg";

export default class AssetInfoComp extends React.Component {
  render() {
    return (
      <>
        <img
          src={Arrow_left}
          alt="back_arrow"
          onClick={() => this.props.toggleMainDisplay("dashboard")}
        />
        <p>STOCK INFO</p>;
      </>
    );
  }
}
AssetInfoComp.propTypes = {
  info: PropTypes.object.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
};
