import React from "react";
import PropTypes from "prop-types";

import User_circle from "@assets/images/User.svg";
import User_fill from "@assets/images/User_fill.svg";
import Chart_alt from "@assets/images/Chart_alt.svg";
import Chart_alt_fill from "@assets/images/Chart_alt_fill.svg";
import Message from "@assets/images/Message.svg";
import Message_alt from "@assets/images/Message_alt.svg";
import Message_alt_fill from "@assets/images/Message_alt_fill.svg";
import ProfileComp from "@pages/dashboard/profile";
import NotifComp from "@pages/dashboard/notification/notification";
import StocksComp from "@pages/dashboard/stocks";
import "@assets/styles/dashboard.scss";
import { WithRouter } from "@components/routingWrapper";
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      displayName: "ProfileComp",
      circle_offsetLeft: "50%",
      newNotification: this.props.newNotification,
      cash: Number.parseInt(localStorage.getItem("cash")),
    };
  }
  changeDisplay = (e) => {
    let display, displayName;
    let value = e.currentTarget ? e.currentTarget.value : e;
    let navImg = document.querySelectorAll(".navImg");
    if (navImg) {
      if (navImg.length == 3) {
        navImg[0].src = User_circle;
        navImg[1].src = Chart_alt;
        navImg[2].src = this.state.newNotification ? Message : Message_alt;
      }
    }
    let comp = document.querySelector("#ProfileCompButton");
    switch (value) {
      case "ProfileComp":
      default:
        comp = document.querySelector("#ProfileCompButton");
        display = (
          <ProfileComp
            setItem={this.props.setItem}
            getItem={this.props.getItem}
            toggleMainDisplay={this.props.toggleMainDisplay}
          />
        );
        if (navImg) if (navImg.length == 3) navImg[0].src = User_fill;
        displayName = "ProfileComp";
        break;
      case "StocksComp":
        comp = document.querySelector("#StocksCompButton");
        display = (
          <StocksComp
            toggleMainDisplay={this.props.toggleMainDisplay}
            isEnd={this.state.isEnd}
            isRunning={this.state.isRunning}
            cash={this.state.cash}
          />
        );
        if (navImg) if (navImg.length == 3) navImg[1].src = Chart_alt_fill;
        displayName = "StocksComp";
        break;
      case "NotifComp":
        comp = document.querySelector("#NotifCompButton");
        this.props.setItem("newNotification", false);
        this.setState({ newNotification: false });
        display = (
          <NotifComp
            setItem={this.props.setItem}
            getItem={this.props.getItem}
            notificationList={this.props.notificationList}
            toggleMainDisplay={this.props.toggleMainDisplay}
          />
        );
        if (navImg) if (navImg.length == 3) navImg[2].src = Message_alt_fill;
        displayName = "NotifComp";
        break;
    }
    localStorage.setItem("dashboard", displayName);
    this.setState({ display: display, displayName: displayName });
    // circle animation ;
    let circle = document.querySelector("#buttonCircle");
    this.setState({
      circle_offsetLeft: comp.offsetLeft + comp.offsetWidth / 2,
    });
    setTimeout(() => {
      circle.style.animationName = "circleAnimation";
      setTimeout(() => {
        circle.style.animationName = "";
      }, 1100);
    }, 1);
  };
  componentDidUpdate(prevProps) {
    // console.log("checking");
    if (this.props.newNotification !== prevProps.newNotification) {
      this.setState({ newNotification: this.props.newNotification });
    }
    if (this.props.isEnd !== prevProps.isEnd) {
      this.setState({ isEnd: this.props.isEnd });
    }
    if (this.props.isRunning !== prevProps.isRunning) {
      this.setState({ isRunning: this.props.isRunning });
    }
  }
  componentDidMount() {
    let display = localStorage.getItem("dashboard");
    this.changeDisplay(display ? display : "");

    socket.addEventListener("message", (event) => {
      if (localStorage.getItem("mainDisplay") == "dashboard") {
        setTimeout(() => {
          console.log(
            localStorage.getItem("dashboard") == "StocksComp",
            event.data.msgType == "CashUpt"
          );
          this.changeDisplay(localStorage.getItem("dashboard"));
          if (localStorage.getItem("dashboard") == "NotifComp") {
            this.setState({
              newNotification: false,
            });
          } else if (localStorage.getItem("dashboard") == "StocksComp") {
            console.log(localStorage.getItem("cash"));
            this.setState({
              cash: Number.parseInt(localStorage.getItem("cash")),
            });
          }
        }, 500);
      }
    });
  }
  render() {
    return (
      <div id="dashboard">
        <div id="main">{this.state.display}</div>
        <div id="fixedNav">
          <button
            style={{ zIndex: 1 }}
            value="ProfileComp"
            id="ProfileCompButton"
            onClick={this.changeDisplay}
          >
            <img
              id="userImg"
              height="32px"
              className="navImg"
              src={User_fill}
              alt="User"
            />
          </button>
          <button
            style={{ zIndex: 1 }}
            value="StocksComp"
            id="StocksCompButton"
            onClick={this.changeDisplay}
          >
            <img
              id="chartImg"
              height="27px"
              className="navImg"
              src={Chart_alt}
              alt="chart"
            />
          </button>
          <button
            style={{ zIndex: 1 }}
            value="NotifComp"
            id="NotifCompButton"
            onClick={this.changeDisplay}
          >
            <img
              id="messageImg"
              height="35px"
              className="navImg"
              src={
                this.state.newNotification
                  ? Message
                  : localStorage.getItem("dashboard") == "NotifComp"
                  ? Message_alt_fill
                  : Message_alt
              }
              alt="message"
            />
          </button>
          <svg
            width={window.innerWidth}
            height={69}
            style={{ position: "absolute", zIndex: 0 }}
          >
            <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="2.98%" stopColor="#223F80" />
              <stop offset="26.65%" stopColor="#444584" />
              <stop offset="101.79%" stopColor="#A43936" />
            </linearGradient>
            <circle
              id="buttonCircle"
              r={22}
              cx={this.state.circle_offsetLeft}
              cy="50%"
              // stroke="black"
              fill={"transparent"}
              strokeWidth={4}
              stroke={"url(#myGradient)"}
            />
          </svg>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  getItem: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  isEnd: PropTypes.bool,
  isRunning: PropTypes.bool,
  newNotification: PropTypes.bool.isRequired,
  notificationList: PropTypes.array.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
export default WithRouter(Dashboard);
