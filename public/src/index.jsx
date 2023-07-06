import React from "react";
import ReactDOM from "react-dom/client";
import SellComp from "@pages/buySell";
import Dashboard from "@pages/dashboard/dashboard";
import InitialComp from "@pages/signInAndSignUp/initial";
import PortfolioComp from "@pages/portfolio";
import TeamComp from "@pages/team/team";
import * as serviceWorkerRegistration from "@utils/serviceWorkerRegistration";
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);

class IndexComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: [],
      year: Number.parseInt(localStorage.getItem("year")),
      mainDisplay: (
        <InitialComp
          toggleMainDisplay={this.toggleMainDisplay}
          setItem={this.setItem}
          getItem={this.getItem}
        />
      ),
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
  toggleMainDisplay = (e, res) => {
    let value =
      typeof e === "string" ? e : e.currentTarget.getAttribute("value");
    console.log(value);
    let displayComp;
    switch (value) {
      case "dashboard":
      default:
        displayComp = (
          <Dashboard
            toggleMainDisplay={this.toggleMainDisplay}
            value={res}
            setItem={this.setItem}
            getItem={this.getItem}
          />
        );
        break;
      case "portfolio":
        displayComp = (
          <PortfolioComp
            toggleMainDisplay={this.toggleMainDisplay}
            setItem={this.setItem}
            getItem={this.getItem}
          />
        );
        break;
      case "team":
        displayComp = (
          <TeamComp
            toggleMainDisplay={this.toggleMainDisplay}
            setItem={this.setItem}
            getItem={this.getItem}
          />
        );
        break;
      case "purchase":
        displayComp = (
          <SellComp
            toggleMainDisplay={this.toggleMainDisplay}
            setItem={this.setItem}
            getItem={this.getItem}
          />
        );
        break;
      case "login":
        displayComp = (
          <InitialComp toggleMainDisplay={this.toggleMainDisplay} />
        );
        break;
    }
    console.log(displayComp);
    this.setState({ mainDisplay: displayComp });
  };

  checkMessage = (message) => {
    let minute, second, cash;

    let notificationList = this.state.notificationList.slice(undefined, 100);
    message.isread = false;

    switch (message.msgType) {
      case "GameChg":
        localStorage.setItem("year", message.year);
        [, minute, second] = message.time.split(":");
        localStorage.setItem("minute", Number.parseInt(minute));
        localStorage.setItem("second", Number.parseInt(second) + 1);
        notificationList.push(message);
        break;
      case "CashUpt":
        cash = localStorage.getItem("cash");
        localStorage.setItem("cash", cash + this.state.cash);
        notificationList.push(message);
        break;
      case "RoleChg":
      case "NewUser":
      case "RemoveUser":
        if (message.groupid == localStorage.getItem("groupid")) {
          notificationList.push(message);
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
  }
  render() {
    console.log(this.state);
    return <section>{this.state.mainDisplay}</section>;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexComp />);
serviceWorkerRegistration.register();
