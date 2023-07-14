import React from "react";
import PropTypes from "prop-types";
// import ReactDOM from "react-dom/client";
import SellComp from "@pages/purchase/buySell";
import Dashboard from "@pages/dashboard/dashboard";
import InitialComp from "@pages/signInAndSignUp/initial";
import PortfolioComp from "@pages/portfolio";
import TeamComp from "@pages/team/team";
// import * as serviceWorkerRegistration from "@utils/serviceWorkerRegistration";
import NewsComp from "@pages/news";
import AssetInfoComp from "@pages/assetInfo";
import { WithRouter } from "@components/routingWrapper";
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);

class MainComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnd: false,
      notificationList: [],
      year: Number.parseInt(localStorage.getItem("year")),
      newNotification: false,
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
      // console.log(this.state);
    });
  };
  getItem = (name) => {
    return this.state[name];
  };
  toggleMainDisplay = (e) => {
    let value =
      typeof e === "string" ? e : e.currentTarget.getAttribute("value");
    console.log(value);
    let displayComp;
    localStorage.setItem("mainDisplay", value);
    switch (value) {
      case "dashboard":
      default:
        displayComp = (
          <Dashboard
            toggleMainDisplay={this.toggleMainDisplay}
            newNotification={this.state.newNotification}
            notificationList={this.state.notificationList}
            isEnd={this.state.isEnd}
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
      case "news":
        displayComp = (
          <NewsComp
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
      case "assetInfo":
        displayComp = (
          <AssetInfoComp toggleMainDisplay={this.toggleMainDisplay} />
        );
        break;
    }
    this.setState({ mainDisplay: displayComp });
  };
  checkMessage = (message) => {
    let minute, second, cash;
    let notificationList = this.state.notificationList;
    let toggleMainDisplayTo = "";
    message.isRead = false;
    // console.log(messag)
    switch (message.msgType) {
      case "GameChg":
        for (let groupid of message.groupList) {
          if (groupid == localStorage.getItem("groupid")) {
            localStorage.setItem("year", message.year);
            localStorage.setItem("phase", message.phase);
            [, minute, second] = message.time.split(":");
            localStorage.setItem("minute", Number.parseInt(minute));
            localStorage.setItem("second", Number.parseInt(second) + 1);
            localStorage.setItem("isRunning", true);

            if (!message.news) return;
            let lastMessage = notificationList.slice(-1)[0];
            if (lastMessage) {
              if (
                message.year == lastMessage.year &&
                message.phase == lastMessage.phase
              )
                break;
            }
            this.setState({ newNotification: true });
            localStorage.setItem("isEnd", false);
            this.setState({ isEnd: true });
            notificationList.push(message);

            localStorage.setItem("dashboard", "NotifComp");
            toggleMainDisplayTo = "dashboard";
          }
        }
        break;
      case "CashUpt":
        for (let groupid of message.groupList) {
          if (groupid == localStorage.getItem("groupid")) {
            cash = Number.parseInt(localStorage.getItem("cash"));
            cash ||= 0;
            localStorage.setItem("cash", Number.parseInt(cash + 500000));
            this.setState({ newNotification: true });
            notificationList.push(message);
            localStorage.setItem("isEnd", false);
            this.setState({ isEnd: true });
            // if (localStorage.getItem("dashboard") == "NotifComp")
            //   this.changeDisplay("NotifComp");
            break;
          }
        }
        break;
      case "RoleChg":
        if (message.groupid == localStorage.getItem("groupid")) {
          if (message.userid == localStorage.getItem("userid"))
            localStorage.setItem("role", message.role);
          this.setState({ newNotification: true });
          notificationList.push(message);
        }
        break;
      case "NewUser":
        if (message.groupid == localStorage.getItem("groupid")) {
          this.setState({ newNotification: true });
          notificationList.push(message);
        }
        break;
      case "DeleteAction":
        //INSERT INTO "users" (userid, name, mobile, password, groupid, role, created_on) VALUES (1, 'User1', '9876543210', 'Password1', 474911, 2, '2023-07-08 10:30:00'),(2, 'User2', '9876543211', 'Password2', 314405, 2, '2023-07-08 11:00:00'),(3, 'User3', '9876543212', 'password3', 474911, 2, '2023-07-08 11:30:00'),(4, 'User4', '9876543213', 'password4', 474911, 2, '2023-07-08 12:00:00'),(5, 'User5', '9876543214', 'password5', 474911, 2, '2023-07-08 12:30:00');
        //INSERT INTO "users" (userid, name, mobile, password, groupid, role, created_on) VALUES (2, 'User2', '9876543211', 'Password2', 733758, 2, '2023-07-08 11:00:00');
        if (message.groupList[0] == localStorage.getItem("groupid")) {
          if (
            message.userid == localStorage.getItem("userid") ||
            !message.userid
          ) {
            //this user id removed
            localStorage.clear();
            localStorage.setItem("removedMsg", JSON.stringify(message));
            this.props.navigate("../removed");
          } else {
            //other users are removed
            notificationList.push(message);
            this.setState({ newNotification: true });
          }
        } else if (message.groupList.length > 0) {
          for (let groupid of message.groupList) {
            if (groupid == localStorage.getItem("groupid")) {
              localStorage.setItem("isRunning", false);
              localStorage.setItem("removedMsg", JSON.stringify(message));
              this.props.navigate("../removed");
              break;
            }
          }
        }
        break;
      case "GamePause":
        if (message.groupList) {
          for (let groupid of message.groupList) {
            if (groupid == localStorage.getItem("groupid")) {
              localStorage.setItem("isRunning", false);
              localStorage.setItem("dashboard", "ProfileComp");
              toggleMainDisplayTo = "dashboard";
              break;
            }
          }
        } else {
          localStorage.setItem("isRunning", false);
          localStorage.setItem("dashboard", "ProfileComp");
          toggleMainDisplayTo = "dashboard";
          //for test only
        }
        break;
      case "EndGame":
        console.log(localStorage.getItem("isEnd"));
        if (message.groupList) {
          for (let groupid of message.groupList) {
            if (groupid == localStorage.getItem("groupid")) {
              console.log("isEnd at main", localStorage.getItem("isEnd"));
              this.setState({ isEnd: true });
              localStorage.setItem("isEnd", true);
              localStorage.setItem("dashboard", "ProfileComp");
              toggleMainDisplayTo = "dashboard";
              break;
            }
          }
        }
        break;
      default:
        break;
    }

    this.setState({ notificationList: notificationList }, () => {
      if (toggleMainDisplayTo != "")
        this.toggleMainDisplay(toggleMainDisplayTo);
    });
    // this.props.setItem("notificationList", notificationList);
  };
  componentDidMount() {
    // When the WebSocket connection is opened
    socket.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    const messageListener = (event) => {
      this.checkMessage(JSON.parse(event.data));
      console.log(
        "Received message from server at main:",
        JSON.parse(event.data)
      );
    };
    socket.removeEventListener("message", messageListener);
    socket.addEventListener("message", messageListener);
    //setting the timer
    if (!localStorage.getItem("minute")) localStorage.setItem("minute", 15);
    if (!localStorage.getItem("second")) localStorage.setItem("second", 0);
    if (!localStorage.getItem("cash")) localStorage.setItem("cash", 0);
    localStorage.setItem("year", 2099);
    localStorage.setItem("phase", 1);
    let display = localStorage.getItem("mainDisplay");
    this.toggleMainDisplay(display ? display : "");
  }
  render() {
    return <section>{this.state.mainDisplay}</section>;
  }
}
MainComp.propTypes = {
  navigate: PropTypes.func.isRequired,
};
export default WithRouter(MainComp);
