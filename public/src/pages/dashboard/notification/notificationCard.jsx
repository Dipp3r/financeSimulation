import React from "react";
import PropTypes from "prop-types";
import Paper from "@assets/images/Paper.svg";
import Coin from "@assets/images/coin.svg";
import Group from "@assets/images/Group.svg";
import Star from "@assets/images/Star.svg";
import white_paper from "@assets/images/white_paper.svg";
import white_group from "@assets/images/white_group.svg";
import white_star from "@assets/images/white_star.svg";
import roleNumToStr from "@utils/roleNumberToString";

export default class NotificationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.notification };
  }
  componentDidMount() {
    let lastNotif = [...document.querySelectorAll(".notif")].pop();
    lastNotif.scrollIntoView();
  }
  afterClick = () => {
    this.setState({ isRead: true }, () => {
      console.log(this.state);
      this.props.changeisRead(this.props.id);
      switch (this.state.msgType) {
        case "GameChg":
          this.props.toggleMainDisplay("news");
          break;
        case "NewUser":
          this.props.toggleMainDisplay("team");
          break;
        case "RoleChg":
          this.props.toggleMainDisplay("team");
          break;
        case "CashUpt":
          this.props.toggleMainDisplay("portfolio");
          break;
        default:
          this.props.toggleMainDisplay("dashboard");
          break;
      }
    });
  };
  render() {
    let string;
    switch (this.state.msgType) {
      case "GameChg":
        return (
          <div
            className={`notif ${this.state.isRead ? "notif-extend" : ""}`}
            onClick={this.afterClick}
          >
            <img src={this.state.isRead ? Paper : white_paper} alt="paper" />
            <p>
              phase{this.state.phase} news | {this.state.year}
            </p>
          </div>
        );
      case "NewUser":
        return (
          <div
            className={`notif ${this.state.isRead ? "notif-extend" : ""}`}
            onClick={this.afterClick}
          >
            <img
              className="coin"
              src={this.state.isRead ? Group : white_group}
              alt="group"
            />
            <p className="text-thin">Arya joined your team</p>
          </div>
        );
      case "RoleChg":
        if (this.state.role == -1) {
          string =
            "relieved of your duties as the " +
            roleNumToStr(this.state.prev_role);
        } else {
          string = "assigned as an " + roleNumToStr(this.state.role);
        }
        return (
          <div
            className={`notif ${this.state.isRead ? "notif-extend" : ""}`}
            onClick={this.afterClick}
          >
            <img
              className="coin"
              src={this.state.isRead ? Star : white_star}
              alt="star"
            />
            {this.state.userid == localStorage.getItem("userid") ? (
              <p className="text-thin">You have been {string}</p>
            ) : (
              <p className="text-thin">
                {this.state.role === "-1"}
                {this.state.name} have been {string}
              </p>
            )}
          </div>
        );
      case "CashUpt":
        return (
          <div
            className={`notif coin-notif ${
              this.state.isRead ? "notif-extend" : ""
            }`}
            onClick={this.afterClick}
          >
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
  changeisRead: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
};
