import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/notif.scss";

import Time from "@components/time";
import NotificationCard from "@components/notificationCard";

const socket = new WebSocket("ws://localhost:3003");
class NotifComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: [],
    };
  }
  getList = () => {
    this.setState(
      { notificationList: this.props.getItem("notificationList") },
      () => {
        console.log(this.state);
      }
    );
  };
  componentDidMount() {
    this.getList();
    socket.addEventListener("message", (event) => {
      console.log("messge at notification");
      let notificationList = [...this.state.notificationList];
      let message = JSON.parse(event.data);
      message.isRead = false;
      if (
        message.msgType == "RoleChg" ||
        message.msgType == "NewUser" ||
        message.msgType == "RemoveUser"
      ) {
        if (message.groupid == localStorage.getItem("groupid")) {
          notificationList.push(message);
        }
      } else {
        notificationList.push(message);
      }
      this.setState({ notificationList: notificationList });
      // this.getList();
    });
  }
  render() {
    return (
      <div id="notification">
        <div id="topBar">
          <div></div>
          <p>Notification</p>
          <Time />
        </div>
        <div id="main">
          {this.state.notificationList.map((notification, index) => {
            return <NotificationCard notification={notification} key={index} />;
          })}
          {/* <div className="notif">
            <img src={Paper} alt="paper" />
            <p>Super breaking news | 2100</p>
          </div>
          <div className="notif">
            <img className="coin" src={Coin} alt="coin" />
            <p className="text-thin">
              ₹1,00,000 of vittae coins has
              <br /> been credited
            </p>
          </div>
          <div className="notif notif-extend">
            <img className="coin" src={Group_fill} alt="group" />
            <p className="text-thin">Arya joined your team</p>
          </div>
          <div className="notif notif-extend">
            <img className="coin" src={Star} alt="star" />
            <p className="text-thin">You’ve been assigned as an Analyst</p>
          </div> */}
        </div>
      </div>
    );
  }
}
NotifComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
};
export default NotifComp;
