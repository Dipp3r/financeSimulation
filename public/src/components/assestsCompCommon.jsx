import React from "react";
import PropTypes from "prop-types";
// import loss from "@assets/images/loss.svg"
import Gain from "@assets/images/gain.svg";
export default class AssetsCompCommon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      totalPrice: this.props.totalPrice,
      position: this.props.position,
      singlePrice: this.props.singlePrice,
      singlePercent: this.props.singlePercent,
    };
  }
  render() {
    return (
      <div
        className={"row " + this.state.position}
        onClick={this.props.toggleMainDisplay}
        value="purchase"
      >
        <p id="name">{this.state.name}</p>
        <div>
          <p>₹{this.state.singlePrice}</p>
          <div>
            <img src={Gain} alt="gain" />
            <p className="gain">{this.state.singlePercent}%</p>
          </div>
        </div>
        <p id="amount">₹{this.state.totalPrice}</p>
      </div>
    );
  }
}
AssetsCompCommon.propTypes = {
  name: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  singlePrice: PropTypes.number.isRequired,
  singlePercent: PropTypes.number.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
};
