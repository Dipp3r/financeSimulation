import React from "react";
import PropTypes from "prop-types";

import link from "@assets/images/link.svg";
import trash from "@assets/images/Trash.svg";
import arrow_left from "@assets/images/Arrow_left.svg";

import PlayerComp from "@components/playerCard";
import DeletePrompt from "./deletePrompt";
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
export default class PlayersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: JSON.parse(localStorage.getItem("groupInfo")),
      playersList: [],
      DeletePrompDisplay: false,
    };
  }
  toggleDeletePromp = () => {
    let display = this.state.DeletePrompDisplay;
    display = !display;
    if (!display) this.props.toggleSession("sessionViewer");
    this.setState({
      DeletePrompDisplay: display,
    });
  };
  copyLink = (event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(
      import.meta.env.VITE_API_PUBLIC_URL + `/${this.state.groupInfo.groupid}`
    );
  };
  groupRename = (event) => {
    let obj = {};
    obj.groupid = this.state.groupInfo.groupid;
    obj.name = event.currentTarget.value;
    fetch(import.meta.env.VITE_API_SERVER_URL + "renameGroup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  };
  fetchPlayerList = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        `team/${this.state.groupInfo.groupid}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let playersList = [];
        data.map((player) => {
          playersList.push(
            <PlayerComp
              playerObj={player}
              fetchPlayerList={this.fetchPlayerList}
              key={player.userid}
            />
          );
        });
        let groupInfo = this.state.groupInfo;
        groupInfo.players = data.length;
        this.setState({ playersList: playersList, groupInfo: groupInfo });
      });
  };
  checkMessage = (message) => {
    if (
      message.msgType == "RoleChg" ||
      message.msgType == "NewUser" ||
      message.msgType == "DeleteAction"
    ) {
      this.fetchPlayerList();
    }
  };
  componentDidMount() {
    this.fetchPlayerList();
    socket.addEventListener("message", (event) => {
      this.checkMessage(JSON.parse(event.data));
      console.log("Received message from server:", JSON.parse(event.data));
    });
  }
  render() {
    return (
      <div id="playersPage" style={{ display: "flex" }}>
        <div id="topBar">
          <div id="top">
            <button
              id="back"
              onClick={this.props.toggleSession}
              value="groupPage"
            >
              <img src={arrow_left} alt="back arrow" />
            </button>
            <div id="topLabel">
              <div>
                <input
                  type="text"
                  id="groupNameInput"
                  defaultValue={this.state.groupInfo.name}
                  onBlur={this.groupRename}
                />
                {/* <p id="groupNum">{this.state.groupInfo.name}</p> */}
                <p id="players">
                  Players <i id="playerCount">{this.state.groupInfo.players}</i>
                </p>
              </div>
              <div>
                <button id="trash" onClick={this.toggleDeletePromp}>
                  <img src={trash} alt="trashIcon" />
                </button>
                <button onClick={this.copyLink}>
                  <img src={link} alt="linkIcon" />
                </button>
              </div>
            </div>
          </div>
          <hr />
        </div>
        <div id="playersList">
          {this.state.DeletePrompDisplay && (
            <DeletePrompt
              type="group"
              id={this.state.groupInfo.groupid}
              name={this.state.groupInfo.name}
              toggleDeletePromp={this.toggleDeletePromp}
            />
          )}
          {this.state.playersList.map((element) => element)}
        </div>
      </div>
    );
  }
}
PlayersPage.propTypes = {
  toggleSession: PropTypes.func.isRequired,
};
