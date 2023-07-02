import React from "react";
import PropTypes from "prop-types";

import "@assets/styles/buySell.scss";
import tick from "@assets/images/tick.svg";
import Coin from "@assets/images/coin.svg";
import Arrow_left from "@assets/images/Arrow_left.svg";
import Time from "@components/time";

class SellComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      sectionType: sessionStorage.getItem("buySellSectionType") || "buy",
    };
  }

  handleClick = () => {
    this.setState({ isClicked: true });
    setTimeout(() => {
      this.setState({ isClicked: false });
    }, 300);
  };

  submit = () => {
    this.handleClick();
    let value = document.querySelector("#amountInput").value;
    let obj = {};
    obj.value = value;
    fetch(import.meta.env.VITE_API_SERVER_URL + "createSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  };

  toggleSection(type) {
    sessionStorage.setItem("buySellSectionType", type);
    this.setState({ sectionType: type });
  }

  render() {
    const { isClicked } = this.state;
    return (
      <div id="sell">
        <div id="success">
          <div id="circle">
            <img src={tick} alt="tick" />
          </div>
          <p>SUCCESSFUL</p>
          <p className="small">Check your portfolio</p>
        </div>
        <div id="topBar">
          <div>
            <img
              src={Arrow_left}
              alt="back_arrow"
              onClick={this.props.toggleMainDisplay}
              value="dashboard"
            />
            <img className="coin" src={Coin} alt="coin" />
            <p>₹30,000</p>
          </div>
          <Time />
        </div>
        <div id="main">
          <div id="about">
            <p>Ram Dam ₹0</p>
            <div>
              <button
                onClick={() => {
                  this.toggleSection("buy");
                }}
                className={this.state.sectionType == "buy" && "buttonClicked"}
              >
                BUY
              </button>
              <button
                onClick={() => {
                  this.toggleSection("sell");
                }}
                className={this.state.sectionType == "sell" && "buttonClicked"}
              >
                SELL
              </button>
            </div>
          </div>
          <div id="content">
            <p>ENTER AMOUNT</p>
            <div id="amount">
              <p>₹</p>
              <input
                id="amountInput"
                type="number"
                placeholder="1000"
                inputMode="numeric"
              />
            </div>
            {this.state.sectionType == "sell" && <button>sell all</button>}
          </div>
          <div id="fixed">
            <button
              className={
                this.state.sectionType + `-button ${isClicked ? "clicked" : ""}`
              }
              onClick={this.submit}
            >
              {this.state.sectionType.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SellComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};

export default SellComp;
