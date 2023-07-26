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
  toggleDeletePromp = (isBack) => {
    let display = this.state.DeletePrompDisplay;
    display = !display;
    if (!display && !isBack) this.props.toggleSession("groupPage");
    this.setState({
      DeletePrompDisplay: display,
    });
  };
  copyLink = (e) => {
    e.target.className = "groupLinkButton groupLinkButtonActive";
    e.stopPropagation();
    navigator.clipboard.writeText(
      import.meta.env.VITE_API_PUBLIC_URL +
        `/login/${this.state.groupInfo.groupid}`
    );
    setTimeout(() => {
      e.target.className = "groupLinkButton";
    }, 500);
  };
  groupRename = (event) => {
    let obj = {};
    obj.groupid = this.state.groupInfo.groupid;
    obj.name = event.currentTarget.value;
    fetch(import.meta.env.VITE_API_SERVER_URL + "renameGroup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(obj),
    }).then((response) => {
      if (response.status == 403 || response.status == 401) {
        this.props.setItem({ isAuth: false });
        throw new Error("unAuth");
      }
    });
  };
  fetchPlayerList = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        `team/${this.state.groupInfo.groupid}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
      .then((response) => {
        if (response.status == 403 || response.status == 401) {
          this.props.setItem({ isAuth: false });
          throw new Error("unAuth");
        }
        return response.json();
      })
      .then((data) => {
        let playersList = [];
        data.map((player) => {
          playersList.push(
            <PlayerComp
              playerObj={player}
              fetchPlayerList={this.fetchPlayerList}
              key={player.userid}
              setItem={this.props.setItem}
              getItem={this.props.getItem}
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
                <button
                  id="trash"
                  onClick={() => this.toggleDeletePromp(false)}
                >
                  <img src={trash} alt="trashIcon" />
                </button>
                <button onClick={this.copyLink} className="groupLinkButton">
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
          {this.state.playersList.length > 0 ? (
            this.state.playersList.map((element) => element)
          ) : (
            <div id="emptyPlayersPg">
              <div className="hourglass"></div>
              <p>Waiting for players to join . . .</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
PlayersPage.propTypes = {
  toggleSession: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
