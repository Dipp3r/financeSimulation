import React from "react";
import PropTypes from "prop-types";

import "@assets/styles/team.scss";

import Arrow_left from "@assets/images/Arrow_left.svg";

import QR from "@assets/images/QR.svg";

import TeamCardComp from "@components/teamCard";
import QRComp from "./QRComp";
import Time from "@components/time";
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class TeamComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [
        {
          name: "AAA",
          phone: "123456789",
          roll: "Executive",
          isExecutive: true,
        },
        {
          name: "BBB",
          phone: "123456789",
          roll: "Accountent",
          isExecutive: false,
        },
        {
          name: "CCC",
          phone: "123456789",
          roll: "Analysist",
          isExecutive: false,
        },
        { name: "DDD", phone: "123456789", roll: "", isExecutive: false },
        { name: "EEE", phone: "123456789", roll: "", isExecutive: false },
      ],
      teamComp: [],
    };
  }
  toggleQR = () => {
    let display = document.querySelector("#QRCompPage").style.display;
    display = display == "none" ? "flex" : "none";
    document.querySelector("#QRCompPage").style.display = display;
  };
  fetchTeamInfo = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        "team/" +
        localStorage.getItem("groupid"),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ teamComp: data });
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
  componentDidMount() {
    socket.addEventListener("message", (event) => {
      let message = JSON.parse(event.data);
      console.log(
        message.msgType == "RoleChg" &&
          message.groupid == localStorage.getItem("groupid")
      );
      if (
        message.msgType == "RoleChg" &&
        message.groupid == localStorage.getItem("groupid")
      ) {
        let list = this.state.teamComp;
        list.forEach((player, index) => {
          if (player.userid == message.userid) {
            list[index].role = message.role;
          }
          this.setState({ teamComp: list });
        });
      }
    });
    this.fetchTeamInfo();
  }
  render() {
    return (
      <div id="team">
        <div id="topBar">
          <div>
            <img
              src={Arrow_left}
              alt="back_arrow"
              onClick={() => {
                setTimeout(
                  () => this.props.toggleMainDisplay("dashboard"),
                  400
                );
              }}
            />
          </div>
          <p className="pageTitle">Team</p>
          <Time />
        </div>
        <div id="main">
          <div
            id="QRCompPage"
            style={{ display: "none" }}
            onClick={this.toggleQR}
          >
            <QRComp />
          </div>

          <button id="fixed" onClick={this.toggleQR}>
            <img src={QR} alt="qr" />
            <p>Invite team</p>
          </button>
          {this.state.teamComp.map((player, index) => {
            return <TeamCardComp key={index} player={player} />;
          })}
        </div>
      </div>
    );
  }
}

TeamComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default TeamComp;
