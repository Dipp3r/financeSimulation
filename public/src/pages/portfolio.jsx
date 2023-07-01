import React from "react";
import PropTypes from "prop-types";

import "@assets/styles/portfolio.scss";
import Arrow_left from "@assets/images/Arrow_left.svg";
import Alarmclock from "@assets/images/Alarmclock.svg";
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
      stocks: [
        {
          id: 0,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 1,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 2,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 3,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 4,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 5,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 6,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 7,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 8,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 9,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 10,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
        {
          id: 11,
          name: "Ram dom",
          totalPrice: 5000,
          changedTotalPrice: 200,
          singlePrice: 100,
          singlePercent: 2,
        },
      ],
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  toggleExpand(e) {
    try {
      let element = e.currentTarget.getAttribute("id");
      let last_card = document.querySelector("#" + element);
      last_card.style.marginBottom = "0px";
    } catch (error) {
      console.log(error);
      //we get error for all the cases except for the last card
    }
    let name = e.currentTarget.getAttribute("name");
    let target = document.querySelector("#" + name);
    let arrow = e.currentTarget.querySelector(".arrow");
    let display = this.state[name];
    console.log(display);
    if (display) {
      display = false;
      target.style.height = "0px";
      arrow.style.transform = "rotateX(0deg)";
    } else {
      display = true;
      target.style.height = `${(this.state.stocks.length - 1) * 70}px`;
      arrow.style.transform = "rotateX(180deg)";
      // target.scrollIntoView({ behavior: "smooth",inline:'center'})
    }
    let obj = {};
    obj[name] = display;
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
          { name: "stocks", value: data.stocks, color: "#223F80" },
          { name: "Mutual funds", value: data.mutual_funds, color: "#406AC8" },
          { name: "commodities", value: data.commodities, color: "#6F82AB" },
          {
            name: "cash",
            value:
              1 ||
              data.cash ||
              data.networth -
                data.stocks -
                data.mutual_funds -
                data.commodities,
            color: "#CADAFF",
          },
        ];
        this.setState({ pieData: pieData }, () => {
          console.log(this.state.pieData);
        });
      });
  };
  componentDidMount() {
    this.fetchInfo();
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
          <div id="timer">
            <img src={Alarmclock} alt="timer" />
            <p>05:00</p>
          </div>
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
              outerRadius={120}
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
            {/* <Tooltip /> */}
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
          <p id="amount">₹ 10,00,00,000</p>
          <div id="row1">
            <p> This year Gain/Loss</p>
            <p> Overall Gain/Loss</p>
          </div>
          <div id="row2">
            <div className="rowContent">
              <img src={loss} alt="loss" />
              <p>20,000</p>
              <p id="percentage">5%</p>
            </div>
            <hr />
            <div className="rowContent">
              <img src={gain} alt="gain" />
              <p>10,000</p>
              <p id="percentage">2.5%</p>
            </div>
          </div>

          <div className="card">
            <div id="left">
              <p>Cash</p>
              <img src={coin} alt="coin" />
            </div>

            <div id="middle" className="mr-2">
              <p>₹30,000</p>
            </div>
          </div>

          <div className="card" name="stocksExpand" onClick={this.toggleExpand}>
            <div id="left">
              <p>Stocks</p>
            </div>

            <div id="middle">
              <p>₹1,00,000</p>
            </div>

            <div id="last">
              <div id="amount">
                <img src={loss} alt="loss" />
                <p className="loss">12,000</p>
                <button>
                  <img className="arrow" src={downArrow} alt="upArrow" />
                </button>
              </div>
            </div>
          </div>

          <div id="stocksExpand" className="expand">
            {this.state.stocks.map((stock) => {
              return (
                <AssetsComp
                  key={stock.id}
                  name={stock.name}
                  totalPrice={stock.totalPrice}
                  changedTotalPrice={stock.changedTotalPrice}
                  singlePrice={stock.singlePrice}
                  singlePercent={stock.singlePercent}
                />
              );
            })}
          </div>

          <div
            className="card"
            name="mutualFundsExpand"
            onClick={this.toggleExpand}
          >
            <div id="left">
              <p>Mutual Funds</p>
            </div>

            <div id="middle">
              <p>₹20,000</p>
            </div>

            <div id="last">
              <div id="amount">
                <img src={gain} alt="gain" />
                <p className="gain">1000</p>
                <button>
                  <img className="arrow" src={downArrow} alt="downArrow" />
                </button>
              </div>
            </div>
          </div>
          <div id="mutualFundsExpand" className="expand">
            {this.state.stocks.map((stock) => {
              return (
                <AssetsComp
                  key={stock.id}
                  name={stock.name}
                  totalPrice={stock.totalPrice}
                  changedTotalPrice={stock.changedTotalPrice}
                  singlePrice={stock.singlePrice}
                  singlePercent={stock.singlePercent}
                />
              );
            })}
          </div>
          <div
            className="card final"
            id="final"
            name="commoditiesExpand"
            onClick={this.toggleExpand}
          >
            <div id="left">
              <p>Commodities</p>
            </div>

            <div id="middle">
              <p>₹3,000</p>
            </div>

            <div id="last">
              <div id="amount">
                <img src={loss} alt="loss" />
                <p className="loss">5,000</p>
                <button>
                  <img className="arrow" src={downArrow} alt="downArrow" />
                </button>
              </div>
            </div>
          </div>
          <div id="commoditiesExpand" className="expand">
            {this.state.stocks.map((stock) => {
              return (
                <AssetsComp
                  key={stock.id}
                  name={stock.name}
                  totalPrice={stock.totalPrice}
                  changedTotalPrice={stock.changedTotalPrice}
                  singlePrice={stock.singlePrice}
                  singlePercent={stock.singlePercent}
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
