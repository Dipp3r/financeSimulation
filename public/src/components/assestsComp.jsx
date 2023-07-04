import React from "react";
import PropTypes from "prop-types";

import loss from "@assets/images/loss.svg";
import gain from "@assets/images/gain.svg";
export default class AssetsComp extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
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
          <div>
            <p>₹{this.props.holdings}</p>
            {this.props.holdings_diff > 0 && (
              <div>
                <img src={gain} alt="gain" />
                <p className="gain">₹{this.props.holdings_diff}</p>
              </div>
            )}
            {this.props.holdings_diff < 0 && (
              <div>
                <img src={loss} alt="loss" />
                <p className="loss">₹{-this.props.holdings_diff}</p>
              </div>
            )}
          </div>
        </div>
        <hr />
      </div>
    );
  }
}
AssetsComp.propTypes = {
  name: PropTypes.string.isRequired,
  holdings: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired,
  holdings_diff: PropTypes.number.isRequired,
};
