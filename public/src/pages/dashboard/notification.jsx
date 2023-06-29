import React from "react";
import "@assets/styles/notif.scss";
import Alarmclock from "@assets/images/Alarmclock.svg";
import Paper from "@assets/images/Paper.svg";
import Coin from "@assets/images/coin.svg";
import Group_fill from "@assets/images/Group_fill.svg";
import Star from "@assets/images/Star.svg";
class NotifComp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="notification">
        <div id="topBar">
          <div></div>
          <p>Notification</p>
          <div id="timer">
            <img src={Alarmclock} alt="timer" />
            <p>05:00</p>
          </div>
        </div>
        <div id="main">
          <div className="notif">
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
          </div>
        </div>
      </div>
    );
  }
}
export default NotifComp;
