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
  checkMessage = (message) => {
    let minute, second, cash;

    let notificationList = this.props.getItem("notificationList");
    message.isRead = false;

    switch (message.msgType) {
      case "GameChg":
        localStorage.setItem("year", message.year);
        localStorage.setItem("phase", message.phase);
        [, minute, second] = message.time.split(":");
        localStorage.setItem("minute", Number.parseInt(minute));
        localStorage.setItem("second", Number.parseInt(second) + 1);
        localStorage.setItem("isRunning", true);
        if (!message.news) return;
        this.setState({ newNotification: true });
        notificationList.push(message);
        this.props.setItem("newNotification", true);

        console.log(window.location.href.split("/").pop());
        if (window.location.href.split("/").pop() == "dashboard") {
          this.changeDisplay("NotifComp");
        } else {
          localStorage.setItem("dashboard", "NotifComp");
          this.props.navigate("../dashboard");
        }
        break;
      case "CashUpt":
        cash = Number.parseInt(localStorage.getItem("cash"));
        cash ||= 0;
        localStorage.setItem("cash", Number.parseInt(cash + 500000));
        this.setState({ newNotification: true });
        notificationList.push(message);
        this.props.setItem("newNotification", true);
        break;
      case "RoleChg":
      case "NewUser":
        if (message.groupid == localStorage.getItem("groupid")) {
          this.setState({ newNotification: true });
          notificationList.push(message);
          this.props.setItem("newNotification", true);
        }
        break;
      case "DeleteAction":
        //INSERT INTO "users" (userid, name, mobile, password, groupid, role, created_on) VALUES (1, 'User1', '9876543210', 'Password1', 474911, 2, '2023-07-08 10:30:00'),(2, 'User2', '9876543211', 'Password2', 314405, 2, '2023-07-08 11:00:00'),(3, 'User3', '9876543212', 'password3', 474911, 2, '2023-07-08 11:30:00'),(4, 'User4', '9876543213', 'password4', 474911, 2, '2023-07-08 12:00:00'),(5, 'User5', '9876543214', 'password5', 474911, 2, '2023-07-08 12:30:00');
        //INSERT INTO "users" (userid, name, mobile, password, groupid, role, created_on) VALUES (2, 'User2', '9876543211', 'Password2', 733758, 2, '2023-07-08 11:00:00');
        console.log(message);
        if (message.groupList[0] == localStorage.getItem("groupid")) {
          if (
            message.userid == localStorage.getItem("userid") ||
            !message.userid
          ) {
            //this user id removed
            localStorage.clear();
            this.props.navigate("../removed");
            localStorage.setItem("removedMsg", JSON.stringify(message));
          } else {
            //other users are removed
            this.setState({ newNotification: true });
            notificationList.push(message);
            this.props.setItem("newNotification", true);
          }
        } else if (message.groupList.length > 0) {
          message.groupList.forEach((groupid) => {
            if (groupid == localStorage.getItem("groupid")) {
              localStorage.setItem("isRunning", false);
              this.props.navigate("../removed");
              return;
            }
          });
        }
        break;
      case "GamePause":
        if (message.groupList) {
          message.groupList.forEach((groupid) => {
            if (groupid == localStorage.getItem("groupid")) {
              localStorage.setItem("isRunning", false);
              localStorage.setItem("dashboard", "ProfileComp");
              this.props.navigate("dashboard");
              return;
            }
          });
        } else {
          localStorage.setItem("isRunning", false);
          localStorage.setItem("dashboard", "ProfileComp");
          this.props.navigate("../dashboard");
          //for test only
        }
        break;
      default:
        break;
    }
    this.setState({ notificationList: notificationList }, () => {
      console.log(this.state);
    });
    this.props.setItem("notificationList", notificationList);
  };

  componentDidMount() {
    // When the WebSocket connection is opened
    socket.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    // When a message is received from the WebSocket server
    socket.addEventListener("message", (event) => {
      this.checkMessage(JSON.parse(event.data));
      console.log("Received message from server:", JSON.parse(event.data));
    });
    //setting the timer
    if (!localStorage.getItem("minute")) localStorage.setItem("minute", 15);
    if (!localStorage.getItem("second")) localStorage.setItem("second", 0);
    if (!localStorage.getItem("cash")) localStorage.setItem("cash", 0);
    localStorage.setItem("year", 2099);
    localStorage.setItem("phase", 1);

    let display = localStorage.getItem("dashboard");
    this.changeDisplay(display ? display : "");
    // socket.addEventListener("message", (event) => {
    //   let message = JSON.parse(event.data);
    //   if (message.msgType == "GameChg") {
    //     this.changeDisplay("NotifComp");
    //   } else if (message.msgType == "GamePause") {
    //     if (message.groupList) {
    //       message.groupList.forEach((groupid) => {
    //         if (groupid == localStorage.getItem("groupid")) {
    //           this.changeDisplay("ProfileComp");
    //           return;
    //         }
    //       });
    //     } else {
    //       this.changeDisplay("ProfileComp");
    //       //for test only
    //     }
    //   }
    // });
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
  navigate: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
export default WithRouter(Dashboard);
