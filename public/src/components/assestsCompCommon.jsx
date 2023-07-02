import React from "react";
import PropTypes from "prop-types";
// import loss from "@assets/images/loss.svg"
import loss from "@assets/images/loss.svg";
import gain from "@assets/images/gain.svg";
export default class AssetsCompCommon extends React.Component {
  toggleToBuy = () => {
    let obj = {};
    obj.name = this.props.name;
    obj.id = this.props.id;
    obj.holdings = this.props.holdings;
    localStorage.setItem("asset", JSON.stringify(obj));
    this.props.toggleMainDisplay("purchase");
  };
  render() {
    return (
      <div className={"row " + this.props.position} onClick={this.toggleToBuy}>
        <p id="name">{this.props.name}</p>
        <div>
          <p>₹{this.props.price}</p>
          {this.props.diff > 0 && (
            <div>
              <img src={gain} alt="gain" />
              <p className="gain">{this.props.diff}%</p>
            </div>
          )}
          {this.props.diff < 0 && (
            <div>
              <img src={loss} alt="loss" />
              <p className="loss">{-this.props.diff}%</p>
            </div>
          )}
        </div>
        <p id="amount">₹{this.props.holdings}</p>
      </div>
    );
  }
}
AssetsCompCommon.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  holdings: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
};
