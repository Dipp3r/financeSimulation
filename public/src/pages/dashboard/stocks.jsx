import React from "react";
import PropTypes from "prop-types";

import "@assets/styles/stocks.scss";
// import Alarmclock from "@assets/images/Alarmclock.svg";
import Coin from "@assets/images/coin.svg";
// import Gain from "@assets/images/gain.svg"
import AssetsCompCommon from "@components/assestsCompCommon";
import Time from "@components/time";
class StocksComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: 0,
      stock: [],
      mutualFund: [],
      commodity: [],
      content: [],
    };
  }
  toggleStatusButton = (e) => {
    let target = e
      ? e.currentTarget
      : document.querySelector("#statusButton").children[0];
    let buttons = document.querySelector("#statusButton").children;
    Array.from(buttons).forEach((button) => {
      button.style.color = "rgba(34, 63, 128, 0.5)";
      button.style.borderBottomColor = "rgba(34, 63, 128, 0.4)";
    });
    target.style.color = "#223F80";
    target.style.borderBottomColor = "#223F80";
    let content;
    switch (target.getAttribute("value")) {
      case "stock":
      default:
        content = this.state.stock;
        break;
      case "mutualFund":
        content = this.state.mutualFund;
        break;
      case "commodities":
        content = this.state.commodity;
        break;
    }
    this.setState({ content: content });
  };
  fetchList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "invest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupid: localStorage.getItem("groupid") }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState(data, () => {
          this.toggleStatusButton();
        });
      });
  };
  componentDidMount() {
    this.fetchList();
  }
  render() {
    {
      console.log(this.state);
    }
    return (
      <div id="stocks">
        <div id="topBar">
          <div>
            <img className="coin" src={Coin} alt="coin" />
            <p>₹{this.state.cash}</p>
          </div>
          <p>Buy/Sell</p>
          <Time />
        </div>
        <div id="main">
          <div id="stockInfo">
            <div id="marquee">
              {this.state.content.map((element, index) => {
                // console.log(element,index)
                return (
                  <div key={index}>
                    <p>
                      {element.name} | {element.price} |
                    </p>
                    {element.diff > 0 && (
                      <a className="gain">{element.diff}%</a>
                    )}
                    {element.diff < 0 && (
                      <a className="loss">{element.diff}%</a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div id="about">
            <div id="statusButton">
              <button onClick={this.toggleStatusButton} value="stock">
                Stocks
              </button>
              <button onClick={this.toggleStatusButton} value="mutualFund">
                Mutual fund
              </button>
              <button onClick={this.toggleStatusButton} value="commodities">
                Commodities
              </button>
            </div>
          </div>
          <div id="content">
            {this.state.content.map((asset, index) => {
              // console.log(element,index)
              return (
                <AssetsCompCommon
                  key={asset.id}
                  id={asset.id}
                  name={asset.name}
                  holdings={asset.holdings}
                  price={asset.price}
                  diff={asset.diff}
                  position={index % 2 === 0 ? "top" : "bottom"}
                  toggleMainDisplay={this.props.toggleMainDisplay}
                />
              );
            })}

            {/* <div class="row top">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="loss">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>
                        <div class="row bottom">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div> */}
          </div>
        </div>
      </div>
    );
  }
}
StocksComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default StocksComp;
