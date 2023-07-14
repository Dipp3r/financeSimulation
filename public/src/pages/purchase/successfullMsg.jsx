import React from "react";
import PropTypes from "prop-types";
import tick from "@assets/images/tick.svg";
export default class SuccessMsgComp extends React.Component {
  render() {
    return (
      <div
        id="successfulMsg"
        style={{ display: this.props.display }}
        onClick={this.props.togglesuccessMsgDisplay}
      >
        <div id="imgContainer">
          <img src={tick} />
        </div>
        <div id="successfulMsgBox">
          <p>successful</p>
          <p>check your portfolio</p>
        </div>
      </div>
    );
  }
}
SuccessMsgComp.propTypes = {
  display: PropTypes.string.isRequired,
  togglesuccessMsgDisplay: PropTypes.func.isRequired,
};
