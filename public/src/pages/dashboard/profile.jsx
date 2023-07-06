import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/profile.scss";
// import Alarmclock from "@assets/images/Alarmclock.svg";
import badge from "@assets/images/badge.svg";
import emptyBadge from "@assets/images/emptyBadge.svg";
import pie_chart from "@assets/images/pie_chart.svg";
import white_group from "@assets/images/white_group.svg";
import Vector from "@assets/images/Vector.svg";
import Coin from "@assets/images/coin.svg";
import Time from "@components/time";
import reward from "@assets/images/rewardCard.svg";
import cash from "@assets/images/cash.svg";
// import share from "@assets/images/share.svg";

/*
import Arrow_left from "@assets/images/Arrow_left.svg"
import User_fill from "@assets/images/User_fill.svg"
import Chart_alt from "@assets/images/Chart_alt.svg"
import Message from "@assets/images/Message.svg";
*/
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class ProfileComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2023,
    };
  }
  triggerDelay = 500;
  toShare = async () => {
    try {
      const response = await fetch(reward);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      if (!navigator.share) return;
      if (!navigator.canShare(file)) return;
      await navigator.share({
        files: [file],
      });

      console.log("Successfully shared");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
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
    let countDownIntervalKey = localStorage.getItem("countDownIntervalKey");
    if (countDownIntervalKey) clearInterval(countDownIntervalKey);
    localStorage.clear();
    this.props.toggleMainDisplay("login");
  };
  componentDidMount() {
    this.updateProfileInfo();

    socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      switch (data.msgType) {
        case "GameChg":
          this.setState({ year: data.year });
          break;
        default:
          break;
      }
    });
  }
  render() {
    return (
      <div id="profile">
        <div id="topBar">
          {/* <img src={Arrow_left} onClick={this.props.togglePortfolioComp} alt="back_arrow" /> */}
          <div></div>
          <p>Profile</p>
          <Time />
        </div>
        <div id="main">
          <div id="circle">
            <div id="progress"></div>
            <p id="title">Year</p>
            <p id="yearNum">{this.state.year}</p>
          </div>
          <div className="badgeRow">
            <img src={badge} alt="badge1" />
            <img src={emptyBadge} alt="emptyBadge" />
            <img src={emptyBadge} alt="emptyBadge" />
          </div>
          <div className="badgeRow">
            <img src={emptyBadge} alt="emptyBadge" />
            <img src={emptyBadge} alt="emptyBadge" />
            <img src={emptyBadge} alt="emptyBadge" />
          </div>
          <div id="card">
            <div id="empty"></div>
            <div id="reward">
              <img
                id="reward"
                src={reward}
                alt="reward"
                onClick={this.toShare}
              />
              <img id="cash" src={cash} alt="cash" />
              {/* <button id="share">
                <img src={share} alt="share" />
                <p>Share</p>
              </button> */}
            </div>
          </div>
          <p id="desc">Will unlock once all the badges have been collected</p>
          <div id="options">
            <div
              className="option"
              onClick={() =>
                setTimeout(
                  () => this.props.toggleMainDisplay("portfolio"),
                  this.triggerDelay
                )
              }
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
              onClick={() =>
                setTimeout(
                  () => this.props.toggleMainDisplay("team"),
                  this.triggerDelay
                )
              }
              value="team"
            >
              <img src={Coin} className="animate" alt="coin" />
              <img src={white_group} alt="team logo" />
              <p>Team</p>
            </div>

            <hr />
            <div
              className="option"
              onClick={() => setTimeout(() => this.logout(), this.triggerDelay)}
            >
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
  getItem: PropTypes.func.isRequired,
};
export default ProfileComp;
