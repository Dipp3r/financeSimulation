import React from "react";
import PropTypes from "prop-types";

import loss from "@assets/images/loss.svg";
import gain from "@assets/images/gain.svg";
export default class AssetsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      totalPrice: this.props.totalPrice,
      changedTotalPrice: this.props.changedTotalPrice,
      singlePrice: this.props.singlePrice,
      singlePercent: this.props.singlePercent,
    };
  }
  render() {
    return (
      <div className="row">
        <p id="name">{this.state.name}</p>
        <div>
          <p>₹{this.state.singlePrice}</p>
          <div>
            <img src={gain} alt="gain" />
            <p className="gain">{this.state.singlePercent}%</p>
          </div>
        </div>
        <div>
          <p>₹{this.state.totalPrice}</p>
          <div>
            <img src={loss} alt="loss" />
            <p className="loss">₹{this.state.changedTotalPrice}</p>
          </div>
        </div>
      </div>
    );
  }
}
AssetsComp.propTypes = {
  name: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
  changedTotalPrice: PropTypes.number.isRequired,
  singlePrice: PropTypes.number.isRequired,
  singlePercent: PropTypes.number.isRequired,
};
