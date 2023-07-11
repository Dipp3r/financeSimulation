/* eslint-disable react/no-unescaped-entities */
import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/notif.scss";

import Time from "@components/time";
import NotificationCard from "./notificationCard";
import empty_notif from "@assets/images/empty_notification.svg";

// const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class NotifComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: this.props.notificationList,
    };
  }
  changeisRead = (index) => {
    let list = this.state.notificationList;
    list[index].isRead = true;
    this.props.setItem("notificationList", list);
    this.setState({ notificationList: list });
  };
  // componentDidUpdate(prevProps) {
  //   if (this.props.notificationList !== prevProps.notificationList) {
  //     this.setState({
  //       notificationList: this.props.getItem("notificationList"),
  //     });
  //     this.props.setItem("newNotification", false);
  //   }
  // }
  componentDidMount() {
    this.props.setItem("newNotification", false);
    // this.setState({
    //   notificationList: this.props.notificationList,
    // });
  }
  render() {
    return (
      <div id="notification">
        <div id="topBar">
          <div></div>
          <p className="pageTitle">Notifications</p>
          <Time />
        </div>
        <div id="main">
          {this.props.notificationList.length == 0 && (
            <div id="empty">
              <img src={empty_notif} alt="notification" />
              <h2>No Notifications</h2>
              <p>We'll notify you when something arrives.</p>
            </div>
          )}
          {this.props.notificationList.map((notification, index) => {
            return (
              <NotificationCard
                id={index}
                key={index}
                notification={notification}
                changeisRead={this.changeisRead}
                toggleMainDisplay={this.props.toggleMainDisplay}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
NotifComp.propTypes = {
  getItem: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  notificationList: PropTypes.array.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default NotifComp;
