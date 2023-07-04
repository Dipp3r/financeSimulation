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
      mainCash: localStorage.getItem("cash"),
      cash: localStorage.getItem("cash"),
      name: "",
      mainHoldings: 0,
      holdings: 0,
      sectionType: sessionStorage.getItem("buySellSectionType") || "buy",
      value: "",
    };
  }
  inputValue = (event) => {
    let value = Math.floor(event.currentTarget.value);
    if (value < 0) value -= value;
    let cash = this.state.mainCash;
    let holdings = this.state.mainHoldings;
    if (this.state.sectionType == "buy") {
      if (value <= cash) {
        cash -= value;
      } else {
        value = cash;
        cash = 0;
      }
      this.setState({ cash: cash, value: value });
    } else if (this.state.sectionType == "sell") {
      if (value <= holdings) {
        holdings -= value;
      } else {
        value = holdings;
        holdings = 0;
      }
      this.setState({ holdings: holdings, value: value });
    }
  };
  handleClick = () => {
    this.setState({ isClicked: true });
    setTimeout(() => {
      this.setState({ isClicked: false });
    }, 300);
  };
  submit = () => {
    this.handleClick();
    let value = this.state.value;
    if (value == 0) return;

    let obj = {};
    obj.amount = value;
    obj.groupid = localStorage.getItem("groupid");
    obj.stockid = this.state.id;
    fetch(import.meta.env.VITE_API_SERVER_URL + this.state.sectionType, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  };
  sellAll = () => {
    let holdings = this.state.mainHoldings;
    this.setState({ value: holdings, holdings: 0 });
  };
  toggleSection(type) {
    sessionStorage.setItem("buySellSectionType", type);
    this.setState({ sectionType: type, value: "" });
  }
  componentDidMount() {
    let obj = JSON.parse(localStorage.getItem("asset"));
    this.setState(obj);
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
            <p>₹{this.state.cash}</p>
          </div>
          <Time />
        </div>
        <div id="main">
          <div id="about">
            <p>
              {this.state.name} &nbsp;&nbsp;₹{this.state.holdings}
            </p>
            <div>
              <button
                onClick={() => {
                  this.toggleSection("buy");
                }}
                className={
                  this.state.sectionType == "buy" ? "buttonClicked" : undefined
                }
              >
                BUY
              </button>
              <button
                onClick={() => {
                  this.toggleSection("sell");
                }}
                className={
                  this.state.sectionType == "sell" ? "buttonClicked" : undefined
                }
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
                placeholder="9999"
                inputMode="numeric"
                onInput={this.inputValue}
                value={this.state.value}
              />
            </div>
            {this.state.sectionType == "sell" && (
              <button onClick={this.sellAll}>sell all</button>
            )}
          </div>
          <div id="fixed">
            <button
              className={
                this.state.sectionType + `-button ${isClicked ? "clicked" : ""}`
              }
              onClick={this.submit}
              disabled={!this.state.value || this.state.value <= 0}
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
