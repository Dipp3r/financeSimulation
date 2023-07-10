import React from "react";
import ReactDOM from "react-dom/client";
import SellComp from "@pages/buySell";
import Dashboard from "@pages/dashboard/dashboard";
import InitialComp from "@pages/signInAndSignUp/initial";
import PortfolioComp from "@pages/portfolio";
import TeamComp from "@pages/team/team";
import * as serviceWorkerRegistration from "@utils/serviceWorkerRegistration";
import NewsComp from "@pages/news";
import AssetInfoComp from "@pages/assetInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
import { HashRouter } from "react-router-dom";

class IndexComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: [],
      year: Number.parseInt(localStorage.getItem("year")),
    };
  }
  setItem = (name, value) => {
    this.setState({ [name]: value }, () => {
      console.log(this.state);
    });
  };
  getItem = (name) => {
    return this.state[name];
  };
  checkMessage = (message) => {
    let minute, second, cash;

    let notificationList = this.state.notificationList.slice(undefined, 100);
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
        notificationList.push(message);
        localStorage.setItem("dashboard", "NotifComp");
        this.toggleMainDisplay("dashboard");
        break;
      case "CashUpt":
        cash = Number.parseInt(localStorage.getItem("cash"));
        cash ||= 0;
        localStorage.setItem("cash", Number.parseInt(cash + 500000));
        notificationList.push(message);
        break;
      case "RoleChg":
      case "NewUser":
        if (message.groupid == localStorage.getItem("groupid")) {
          notificationList.push(message);
        }
        break;
      case "DeleteAction":
        if (message.groupid == localStorage.getItem("groupid")) {
          // if (message.userid == localStorage.getItem("userid")) {
          //   window.close();
          // }
          notificationList.push(message);
          window.close();
        }
        break;
      case "GamePause":
        if (message.groupList) {
          message.groupList.forEach((groupid) => {
            if (groupid == localStorage.getItem("groupid")) {
              localStorage.setItem("isRunning", false);
              localStorage.setItem("dashboard", "ProfileComp");
              this.toggleMainDisplay("dashboard");
              return;
            }
          });
        } else {
          localStorage.setItem("isRunning", false);
          localStorage.setItem("dashboard", "ProfileComp");
          this.toggleMainDisplay("dashboard");
          //for test only
        }
        break;
      default:
        break;
    }
    this.setState({ notificationList: notificationList });
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
    // let display = localStorage.getItem("mainDisplay");
    // this.toggleMainDisplay(display ? display : "");
  }
  render() {
    return (
      <BrowserRouter history={HashRouter}>
        <Routes history={HashRouter}>
          {/* <Route path="*" index element={<ErrorComp />} /> */}
          <Route path="/:groupid" element={<InitialComp />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard setItem={this.setItem} getItem={this.getItem} />
            }
          />
          <Route
            path="/portfolio"
            element={
              <PortfolioComp setItem={this.setItem} getItem={this.getItem} />
            }
          />
          <Route
            path="/team"
            element={<TeamComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route
            path="/purchase"
            element={<SellComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route
            path="/purchase"
            element={<SellComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route
            path="/news"
            element={<NewsComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route path="/assetInfo" element={<AssetInfoComp />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexComp />);
serviceWorkerRegistration.register();

//update session set year = 2099,phase = 1,_2100 = 0,_2101 = 0,_2102 = 0,_2103 = 0,_2104 = 0,_2105 = 0,_2106 = 0,start = 0;
