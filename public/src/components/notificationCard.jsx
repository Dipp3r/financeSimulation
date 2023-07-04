import React from "react";
import PropTypes from "prop-types";
import Paper from "@assets/images/Paper.svg";
import Coin from "@assets/images/coin.svg";
import Group_fill from "@assets/images/Group_fill.svg";
import Star from "@assets/images/Star.svg";
import roleNumToStr from "../utils/roleNumberToString";

export default class NotificationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.notification };
  }
  render() {
    switch (this.state.msgType) {
      case "GameChg":
        return (
          <div className="notif">
            <img src={Paper} alt="paper" />
            <p>
              phase{this.state.phase} news | {this.state.year}
            </p>
          </div>
        );
      case "NewUser":
        return (
          <div className="notif notif-extend">
            <img className="coin" src={Group_fill} alt="group" />
            <p className="text-thin">Arya joined your team</p>
          </div>
        );
      case "RoleChg":
        return (
          <div className={`notif ${this.state.isRead ? "notif-extend" : ""}`}>
            <img className="coin" src={Star} alt="star" />
            {this.state.userid == localStorage.getItem("userid") ? (
              <p className="text-thin">
                You have been assigned as an {roleNumToStr(this.state.role)}
              </p>
            ) : (
              <p className="text-thin">
                {this.state.name} have been assigned as an{" "}
                {roleNumToStr(this.state.role)}
              </p>
            )}
          </div>
        );
      case "CashUpt":
        return (
          <div className="notif coin-notif">
            <img className="coin" src={Coin} alt="coin" />
            <p className="text-thin">
              ₹{this.state.cash} of vittae coins has
              <br /> been credited
            </p>
          </div>
        );
    }
  }
}
NotificationCard.propTypes = {
  notification: PropTypes.object.isRequired,
};
