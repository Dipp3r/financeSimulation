import React from "react";
import PropTypes from "prop-types";

import "@assets/styles/portfolio.scss";
import Arrow_left from "@assets/images/Arrow_left.svg";
// import Alarmclock from "@assets/images/Alarmclock.svg";
// import PieChart from "@assets/images/PieChart.svg"
import dot1 from "@assets/images/dot1.svg";
import dot3 from "@assets/images/dot3.svg";
import dot2 from "@assets/images/dot2.svg";
import dot4 from "@assets/images/dot4.svg";
import loss from "@assets/images/loss.svg";
import gain from "@assets/images/gain.svg";
import coin from "@assets/images/coin.svg";
// import upArrow from "@assets/images/upArrow.svg"
import downArrow from "@assets/images/downArrow.svg";

import AssetsComp from "@components/assestsComp";

import { PieChart, Pie, Cell } from "recharts";
import Time from "@components/time";
// import { Pie } from 'react-chartjs-2';

class PortfolioComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stocksExpand: false,
      commoditiesExpand: false,
      mutualFundsExpand: false,
      pie: undefined,
      pieData: [
        { name: "stocks", value: 0, color: "#223F80" },
        { name: "Mutual funds", value: 0, color: "#406AC8" },
        { name: "commidities", value: 0, color: "#6F82AB" },
        { name: "cash", value: 1, color: "#CADAFF" },
      ],
      stock: 0,
      mutualFund: 0,
      commodity: 0,
      stock_diff: 0,
      mutualFund_diff: 0,
      commodity_diff: 0,
      stockList: [],
      mutualFundList: [],
      commodityList: [],
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  toggleExpand(event, contentLength) {
    let name = event.currentTarget.getAttribute("name");
    let target = document.querySelector("#" + name);
    let arrow = event.currentTarget.querySelector(".arrow");
    let display = this.state[name];
    console.log(display, target);
    if (display) {
      target.style.height = "0px";
      arrow.style.transform = "rotateX(0deg)";
    } else {
      target.style.height = `${(contentLength + 1) * 70}px`;
      arrow.style.transform = "rotateX(180deg)";
      // target.scrollIntoView({ behavior: "smooth",inline:'center'})
    }
    let obj = {};
    obj[name] = !display;
    this.setState(obj);
  }
  fetchInfo = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        "portfolio/" +
        localStorage.getItem("groupid"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({"userid":localStorage.getItem('userid')})
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let pieData = [
          { name: "stocks", value: data.stock, color: "#223F80" },
          { name: "Mutual funds", value: data.mutualFund, color: "#406AC8" },
          { name: "commodities", value: data.commodity, color: "#6F82AB" },
          {
            name: "cash",
            value:
              data.cash ||
              data.networth - data.stock - data.mutualFund - data.commodity ||
              1,
            color: "#CADAFF",
          },
        ];
        this.setState({ pieData: pieData, ...data }, () => {
          console.log(this.state);
        });
      });
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
          console.log("state: ", this.state);
        });
      });
  };
  componentDidMount() {
    this.fetchInfo();
    this.fetchList();
  }
  render() {
    return (
      <div id="portfolio">
        <div id="topBar">
          <img
            src={Arrow_left}
            onClick={this.props.toggleMainDisplay}
            value="dashboard"
            alt="back_arrow"
          />
          <p>Portfolio</p>
          <Time />
        </div>
        <div id="main">
          {/* <img src={PieChart} alt="piechart"/> */}
          <PieChart width={300} height={300}>
            <Pie
              data={this.state.pieData}
              color="#000000"
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            >
              {this.state.pieData.map((entry, index) => {
                return (
                  <Cell
                    style={{ outline: "none" }}
                    fill={entry.color}
                    key={index}
                  />
                );
              })}
            </Pie>
            {/* <Legend /> */}
          </PieChart>
          <div className="row">
            <div className="column">
              <div className="content">
                <img src={dot1} alt="stocks" />
                <p>Stocks</p>
              </div>
              <div className="content">
                <img src={dot3} alt="Commodities" />
                <p>Commodities</p>
              </div>
            </div>

            <div className="column">
              <div className="content">
                <img src={dot2} alt="Mutual funds" />
                <p>Mutual funds</p>
              </div>
              <div className="content">
                <img src={dot4} alt="Cash" />
                <p>Cash</p>
              </div>
            </div>
          </div>
          <p id="title">NET WORTH</p>
          <p id="amount">₹ {this.state.networth}</p>
          <div id="row1">
            <p> This year Gain/Loss</p>
            <p> Overall Gain/Loss</p>
          </div>
          <div id="row2">
            <div className="rowContent">
              {this.state.yearly < 0 && <img src={loss} alt="loss" />}
              {this.state.yearly < 0 && <img src={gain} alt="gain" />}
              <p>₹{this.state.yearly || "0"}</p>
              {this.state.yearly_diff > 0 && (
                <p id="percentage">{this.state.yearly_diff}%</p>
              )}
            </div>
            <hr />
            <div className="rowContent">
              {this.state.overall < 0 && <img src={loss} alt="loss" />}
              {this.state.overall < 0 && <img src={gain} alt="gain" />}
              <p>₹{this.state.overall || "0"}</p>
              {this.state.overall_diff > 0 && (
                <p id="percentage">{this.state.overall_diff}%</p>
              )}
            </div>
          </div>

          <div className="card">
            <div id="left">
              <p>Cash</p>
              <img src={coin} alt="coin" />
            </div>

            <div id="middle" className="mr-2">
              <p>₹ {this.state.cash}</p>
            </div>
          </div>

          <div
            className="card"
            name="stocksExpand"
            onClick={(event) => {
              this.toggleExpand(event, this.state.stockList.length);
            }}
          >
            <div id="left">
              <p>Stocks</p>
            </div>

            <div id="middle">
              <p>₹{this.state.stock}</p>
            </div>

            <div id="last">
              <div id="amount">
                {this.state.stock_diff < 0 && (
                  <>
                    <img src={loss} alt="loss" />
                    <p className="loss">{this.state.stock_diff}</p>
                  </>
                )}
                {this.state.stock_diff > 0 && (
                  <>
                    <img src={gain} alt="gain" />
                    <p className="gain">{this.state.stock_diff}</p>
                  </>
                )}
                <button>
                  <img className="arrow" src={downArrow} alt="upArrow" />
                </button>
              </div>
            </div>
          </div>

          <div id="stocksExpand" className="expand">
            {this.state.stockList.map((stock) => {
              return (
                <AssetsComp
                  key={stock.id}
                  name={stock.name}
                  holdings={stock.holdings}
                  price={stock.price}
                  diff={stock.diff}
                  holdings_diff={stock.holdings_diff}
                />
              );
            })}
          </div>

          <div
            className="card"
            name="mutualFundsExpand"
            onClick={(event) => {
              this.toggleExpand(event, this.state.mutualFundList.length);
            }}
          >
            <div id="left">
              <p>Mutual Funds</p>
            </div>

            <div id="middle">
              <p>₹{this.state.mutualFund}</p>
            </div>

            <div id="last">
              <div id="amount">
                {this.state.mutualFund_diff < 0 && (
                  <>
                    <img src={loss} alt="loss" />
                    <p className="loss">{this.state.mutualFund_diff}</p>
                  </>
                )}
                {this.state.mutualFund_diff > 0 && (
                  <>
                    <img src={gain} alt="gain" />
                    <p className="gain">{this.state.mutualFund_diff}</p>
                  </>
                )}
                <button>
                  <img className="arrow" src={downArrow} alt="downArrow" />
                </button>
              </div>
            </div>
          </div>
          <div id="mutualFundsExpand" className="expand">
            {this.state.mutualFundList.map((stock) => {
              return (
                <AssetsComp
                  key={stock.id}
                  name={stock.name}
                  holdings={stock.holdings}
                  price={stock.price}
                  diff={stock.diff}
                  holdings_diff={stock.holdings_diff}
                />
              );
            })}
          </div>
          <div
            className="card final"
            id="final_stock"
            name="commoditiesExpand"
            onClick={(event) => {
              this.toggleExpand(event, this.state.commodityList.length);
            }}
          >
            <div id="left">
              <p>Commodities</p>
            </div>

            <div id="middle">
              <p>₹{this.state.commodity}</p>
            </div>

            <div id="last">
              <div id="amount">
                {this.state.commodity_diff < 0 && (
                  <>
                    <img src={loss} alt="loss" />
                    <p className="loss">{this.state.commodity_diff}</p>
                  </>
                )}
                {this.state.commodity_diff > 0 && (
                  <>
                    <img src={gain} alt="gain" />
                    <p className="gain">{this.state.commodity_diff}</p>
                  </>
                )}
                <button>
                  <img className="arrow" src={downArrow} alt="downArrow" />
                </button>
              </div>
            </div>
          </div>
          <div id="commoditiesExpand" className="expand">
            {this.state.commodityList.map((stock) => {
              return (
                <AssetsComp
                  key={stock.id}
                  name={stock.name}
                  holdings={stock.holdings}
                  price={stock.price}
                  diff={stock.diff}
                  holdings_diff={stock.holdings_diff}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
PortfolioComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};

export default PortfolioComp;
