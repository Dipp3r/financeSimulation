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

const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      displayName: "ProfileComp",
      circle_offsetLeft: "50%",
    };
  }
  changeDisplay = (e) => {
    let display, displayName;
    let value = e.currentTarget ? e.currentTarget.value : e;
    let navImg = document.querySelectorAll(".navImg");
    navImg[0].src = User_circle;
    navImg[1].src = Chart_alt;
    navImg[2].src = this.props.newNotification ? Message : Message_alt;
    let comp = document.querySelector("#ProfileCompButton");
    switch (value) {
      case "ProfileComp":
      default:
        comp = document.querySelector("#ProfileCompButton");
        display = (
          <ProfileComp
            setItem={this.props.setItem}
            getItem={this.props.getItem}
          />
        );
        navImg[0].src = User_fill;
        displayName = "ProfileComp";
        break;
      case "StocksComp":
        comp = document.querySelector("#StocksCompButton");
        display = <StocksComp />;
        navImg[1].src = Chart_alt_fill;
        displayName = "StocksComp";
        break;
      case "NotifComp":
        comp = document.querySelector("#NotifCompButton");
        this.props.setItem("newNotification", false);
        display = (
          <NotifComp
            setItem={this.props.setItem}
            getItem={this.props.getItem}
          />
        );
        navImg[2].src = Message_alt_fill;
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
      circle.classList.add("circleScaleDown");
    }, 100);

    // Scale up after 4 seconds
    setTimeout(() => {
      circle.classList.remove("circleScaleDown");
    }, 500);
  };
  componentDidUpdate(prevProps) {
    if (this.props.newNotification !== prevProps.newNotification) {
      this.setState({ notification: this.props.newNotification });
    }
  }
  componentDidMount() {
    let display = localStorage.getItem("dashboard");
    this.changeDisplay(display ? display : "");
    socket.addEventListener("message", (event) => {
      let message = JSON.parse(event.data);
      if (message.msgType == "GameChg") {
        this.changeDisplay("NotifComp");
      } else if (message.msgType == "GamePause") {
        if (message.groupList) {
          message.groupList.forEach((groupid) => {
            if (groupid == localStorage.getItem("groupid")) {
              this.changeDisplay("ProfileComp");
              return;
            }
          });
        } else {
          this.changeDisplay("ProfileComp");
          //for test only
        }
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
            <img id="userImg" className="navImg" src={User_fill} alt="User" />
          </button>
          <button
            style={{ zIndex: 1 }}
            value="StocksComp"
            id="StocksCompButton"
            onClick={this.changeDisplay}
          >
            <img id="chartImg" className="navImg" src={Chart_alt} alt="chart" />
          </button>
          <button
            style={{ zIndex: 1 }}
            value="NotifComp"
            id="NotifCompButton"
            onClick={this.changeDisplay}
          >
            <img
              id="messageImg"
              className="navImg"
              src={
                this.props.newNotification
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
              r={25}
              cx={this.state.circle_offsetLeft}
              cy="50%"
              // stroke="black"
              fill={"transparent"}
              strokeWidth={5}
              stroke={"url(#myGradient)"}
              style={{
                transitionDuration: "1s",
                transitionTimingFunction: "cubic - bezier(0.87, 1.22, 0, 0.92)",
              }}
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
  newNotification: PropTypes.bool.isRequired,
};
export default Dashboard;
