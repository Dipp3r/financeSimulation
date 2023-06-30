import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/profile.scss";
import Alarmclock from "@assets/images/Alarmclock.svg";
import badge from "@assets/images/badge.svg";
import emptyBadge from "@assets/images/emptyBadge.svg";
import pie_chart from "@assets/images/pie_chart.svg";
import Group from "@assets/images/Group.svg";
import Vector from "@assets/images/Vector.svg";
import Coin from "@assets/images/coin.svg";
/*
import Arrow_left from "@assets/images/Arrow_left.svg"
import User_fill from "@assets/images/User_fill.svg"
import Chart_alt from "@assets/images/Chart_alt.svg"
import Message from "@assets/images/Message.svg";
*/

class ProfileComp extends React.Component {
  // constructor(props){
  //     super(props);
  // }
  updateProfileInfo = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        "portfolio/" +
        localStorage.getItem("groupid"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({"userid":localStorage.getItem('userid')})
      }
    )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          // this.props.toggleMainDisplay("dashboard")
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data
        console.log(data);
      });
  };
  logout = () => {
    localStorage.clear();
    this.props.toggleMainDisplay("login");
  };
  componentDidMount() {
    this.updateProfileInfo();
  }
  render() {
    return (
      <div id="profile">
        <div id="topBar">
          {/* <img src={Arrow_left} onClick={this.props.togglePortfolioComp} alt="back_arrow" /> */}
          <div></div>
          <p>profile</p>
          <div id="timer">
            <img src={Alarmclock} alt="timer" />
            <p>05:00</p>
          </div>
        </div>
        <div id="main">
          <div id="circle">
            <div id="progress"></div>
            <p id="title">Year</p>
            <p id="yearNum">2100</p>
          </div>
          <div id="badgeStart" className="badgeRow">
            <img src={badge} alt="badge1" />
            <img src={emptyBadge} alt="emptyBadge" />
            <img src={emptyBadge} alt="emptyBadge" />
          </div>
          <div className="badgeRow">
            <img src={emptyBadge} alt="emptyBadge" />
            <img src={emptyBadge} alt="emptyBadge" />
            <img src={emptyBadge} alt="emptyBadge" />
            <img src={emptyBadge} alt="emptyBadge" />
          </div>
          <div id="card"></div>
          <p id="desc">Will unlock once all the badges have been collected</p>
          <div id="options">
            <div
              className="option"
              onClick={this.props.toggleMainDisplay}
              value="portfolio"
            >
              <img src={Coin} className="animate" alt="coin" />
              <img src={pie_chart} alt="portfolio logo" />
              <p>Portfolio</p>
            </div>
            <hr />

            <div
              className="option"
              id="team"
              onClick={this.props.toggleMainDisplay}
              value="team"
            >
              <img src={Coin} className="animate" alt="coin" />
              <img src={Group} alt="team logo" />
              <p>Team</p>
            </div>

            <hr />
            <div className="option" onClick={this.logout}>
              <img src={Coin} className="animate" alt="coin" />
              <img src={Vector} alt="logout logo" />
              <p>Logout</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ProfileComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default ProfileComp;