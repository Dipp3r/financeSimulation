import React from "react";
import PropTypes from "prop-types";

import search from "@assets/images/Search.svg";
import add_round from "@assets/images/Add_round.svg";
import arrow_left from "@assets/images/Arrow_left.svg";
import Date_range from "@assets/images/Date_range.svg";
// import Alarmclock_grey from "@assets/images/Alarmclock_grey.svg";
import Expand_left_double from "@assets/images/Expand_left_double.svg";
import Expand_left from "@assets/images/Expand_left.svg";
import Expand_right from "@assets/images/Expand_right.svg";
import Expand_right_double from "@assets/images/Expand_right_double.svg";
import Expand_left_double_grey from "@assets/images/Expand_left_double_grey.svg";
import Expand_left_grey from "@assets/images/Expand_left_grey.svg";
import Expand_right_grey from "@assets/images/Expand_right_grey.svg";
import Expand_right_double_grey from "@assets/images/Expand_right_double_grey.svg";
import link from "@assets/images/link.svg";
import Time from "@components/time";
import getPhaseString from "@utils/getPhaseString";
import EndPrompt from "./EndPrompt";
import empty_group from "@assets/images/empty_group.svg";

const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
export default class GroupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
      isRunning: false,
      time: "05:00",
      year: "2099",
      phase: "1",
      childState: {},
      newTime: null,
      endPromptDisplay: "none",
    };
  }
  searchGroup = (e) => {
    let list = this.state.groupList;
    if (e.currentTarget.value == "") {
      this.displayGroups(list);
    }
    let reg = new RegExp(e.currentTarget.value, "i");
    list = list.filter((group) => {
      return reg.test(group.name);
    });
    this.displayGroups(list);
  };
  displayGroups = (list) => {
    let container = document.querySelector("#groupsList");
    if (!container) return;
    if (container.replaceChildren) {
      container.replaceChildren();
    } else {
      container.innerHTML = "";
    }
    if (list.length > 0) {
      let card,
        groupBox,
        groupInfo,
        linkButton,
        players_count,
        linkIcon,
        playerBox;
      for (let group of list) {
        card = document.createElement("div");
        card.className = "card";
        groupBox = document.createElement("div");
        groupBox.id = "groupBox";

        groupInfo = document.createElement("p");
        groupInfo.id = "groupInfo";

        linkButton = document.createElement("button");
        linkButton.className = "groupLinkButton";
        linkButton.onclick = this.togglePlayersPage;
        linkIcon = document.createElement("img");
        linkIcon.src = link;
        groupBox.appendChild(groupInfo);
        linkButton.appendChild(linkIcon);
        linkButton.onclick = (e) => {
          e.target.className = "groupLinkButton groupLinkButtonActive";
          e.stopPropagation();
          navigator.clipboard.writeText(
            import.meta.env.VITE_API_PUBLIC_URL + `/login/${group.groupid}`
          );
          setTimeout(() => {
            e.target.className = "groupLinkButton";
          }, 500);
        };
        groupBox.appendChild(linkButton);

        playerBox = document.createElement("p");
        playerBox.style =
          "display:flex;flex-direction:row;font-family: 'Montserrat';font-style: normal;font-weight: 500;font-size: 18px;color: rgba(34, 63, 128, 0.4);";
        playerBox.id = "playerBox";
        players_count = document.createElement("p");
        players_count.style =
          "margin-left:15px;font-family: 'Montserrat';font-style: normal;font-weight: 500;font-size: 18px;color: #3F3F3F;";
        players_count.innerText = `${group.players}`;
        groupInfo.innerText = `${group.name}`;
        playerBox.innerText = "players";
        playerBox.appendChild(players_count);
        card.appendChild(groupBox);
        card.appendChild(playerBox);
        card.onclick = () => {
          // for(let key in group){
          //   localStorage.setItem(key , group[key])
          // }
          localStorage.setItem("groupInfo", JSON.stringify(group));
          this.props.toggleSession("playersPage");
        };
        container.appendChild(card);
      }
    } else {
      let emptyDiv = document.createElement("div");
      emptyDiv.id = "emptyGroupDiv";
      let illustration = document.createElement("img");
      illustration.src = empty_group;
      let p2 = document.createElement("p");
      p2.id = "emptyGroup2";
      p2.innerText = `No group yet, add new group by clicking the "create group" button.`;
      emptyDiv.appendChild(illustration);
      emptyDiv.appendChild(p2);
      container.appendChild(emptyDiv);
    }
  };
  startSession = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        (!this.state.isRunning ? "start" : "pause"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionid: localStorage.getItem("currentSessionID"),
          time: this.state.newTime ? "00:" + this.state.newTime : null,
        }),
      }
    ).then((response) => {
      if (response.status == 200) {
        let isRunning = this.state.isRunning;
        this.setState({ isRunning: !isRunning, newTime: null });
        localStorage.setItem(
          localStorage.getItem("currentSessionID") + "_isRunning",
          !isRunning
        );
      }
    });
  };
  updateGame = (operation, option) => {
    if (this.state.isRunning) return;
    fetch(import.meta.env.VITE_API_SERVER_URL + "gamechange", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionid: localStorage.getItem("currentSessionID"),
        OP: operation,
        option: option == "year" ? "1" : "0",
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        this.setState({
          year: message.year,
          phase: message.phase,
          time: message.time.slice(3, undefined),
          isEnd: false,
        });
        localStorage.setItem(
          localStorage.getItem("currentSessionID") + "_isEnd",
          false
        );
      });
  };
  fetchGroupList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionid: Number.parseInt(localStorage.getItem("currentSessionID")),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.displayGroups(data.groupList);
        // this.props.setItem({ groupList: data });
        data.time = data.time.slice(3, undefined);
        this.setState({
          ...data,
          isRunning: data.start == "1" ? true : false,
        });
        localStorage.setItem(
          localStorage.getItem("currentSessionID") + "_isRunning",
          data.start == "1" ? true : false
        );
      });
  };
  inputInput = (event) => {
    if (this.state.isRunning) {
      event.currentTarget.blur();
      return;
    }
    let value = event.currentTarget.value;
    value.replace(/[^0-9:]/g, "");
    let values = value.split(":");
    let minute, second;
    if (values.length == 2) [minute, second] = values;
    minute ??= 0;
    second ??= 0;
    if (Number.parseInt(minute) > 60) minute = 60;
    if (Number.parseInt(second) > 60) second = 60;
    this.setState({ time: `${minute.toString()}:${second.toString()}` });
    event.currentTarget.value = `${minute.toString()}:${second.toString()}`;
  };
  checkMessage(message) {
    console.log(message.msgType);
    // msgType: 'GameChg', year: 2106, phase: 4, time: '00:00:10'
    if (message.msgType == "GameChg") {
      // if (message.sessionid != localStorage.getItem("currentSessionID")) return;
      this.setState({
        year: message.year,
        phase: message.phase,
        time: message.time.slice(3, undefined),
      });
    } else if (message.msgType == "AdminGameChg") {
      // if (message.sessionid != localStorage.getItem("currentSessionID")) return;
      this.setState({
        year: message.year,
        phase: message.phase,
        time: message.time.slice(3, undefined),
      });
    }
    if (message.msgType == "EndGame") {
      console.log(
        message.sessionid ==
          Number.parseInt(localStorage.getItem("currentSessionID"))
      );
      if (
        message.sessionid ==
        Number.parseInt(localStorage.getItem("currentSessionID"))
      )
        this.setState({ isEnd: true, isRunning: false });
      localStorage.setItem(
        localStorage.getItem("currentSessionID") + "_isEnd",
        true
      );
    }
  }
  toggleEndPromp = () => {
    let endPromptDisplay =
      this.state.endPromptDisplay == "none" ? "flex" : "none";
    this.setState({ endPromptDisplay: endPromptDisplay });
  };
  componentDidMount() {
    this.setState({
      isEnd: JSON.parse(
        localStorage.getItem(
          localStorage.getItem("currentSessionID") + "_isEnd"
        )
      ),
      isRunning: JSON.parse(
        localStorage.getItem(
          localStorage.getItem("currentSessionID") + "_isRunning"
        )
      ),
    });
    this.fetchGroupList();
    // }
    socket.addEventListener("message", (event) => {
      this.checkMessage(JSON.parse(event.data));
      console.log("Received message from server:", JSON.parse(event.data));
    });
  }
  timeChange = (newTime) => {
    this.setState({ time: newTime, newTime: newTime });
  };
  render() {
    return (
      <div id="groupPage">
        <div id="topBar">
          <div id="top">
            <button
              id="back"
              onClick={this.props.toggleSession}
              value="sessionViewer"
            >
              <img src={arrow_left} alt="back arrow" />
            </button>
            <div id="searchDiv">
              <img src={search} alt="search icon" />
              <input type="text" id="searchBar" onInput={this.searchGroup} />
            </div>
            <button
              id="create"
              onClick={this.props.toggleSession}
              value="createGroupPage"
            >
              <p>Group</p>
              <div id="add">
                <img src={add_round} alt="add" />
              </div>
            </button>
          </div>

          <div id="second">
            <div id="navBar">
              <div id="portion1">
                <div className="navComp">
                  <img src={Date_range} alt="Date_range" />
                  <p>{this.state.year}</p>
                </div>
                <p>|</p>
                <div>
                  <p>{getPhaseString(this.state.phase)}</p>
                </div>
                <p>|</p>
                <div className="navComp">
                  <Time
                    timeChange={this.timeChange}
                    time={this.state.time}
                    isRunning={this.state.isRunning}
                    isEnd={this.state.isEnd}
                  />
                </div>
              </div>
              <div id="navigate">
                <button>
                  <img
                    src={
                      this.state.isRunning
                        ? Expand_left_double_grey
                        : Expand_left_double
                    }
                    alt="expand left"
                    onClick={() => this.updateGame("-", "year")}
                  />
                </button>
                <button>
                  <img
                    src={this.state.isRunning ? Expand_left_grey : Expand_left}
                    alt="left"
                    onClick={() => this.updateGame("-", "phase")}
                  />
                </button>
                <button>
                  <img
                    src={
                      this.state.isRunning ? Expand_right_grey : Expand_right
                    }
                    alt="right"
                    onClick={() => this.updateGame("+", "phase")}
                  />
                </button>
                <button>
                  <img
                    src={
                      this.state.isRunning
                        ? Expand_right_double_grey
                        : Expand_right_double
                    }
                    alt="expand right"
                    onClick={() => this.updateGame("+", "year")}
                  />
                </button>
              </div>
            </div>
            <button id="gameStatus" onClick={this.startSession}>
              {!this.state.isRunning ? "Start" : "Pause"}
            </button>
          </div>
        </div>
        <EndPrompt
          id={Number.parseInt(localStorage.getItem("currentSessionID"))}
          name={localStorage.getItem("currentSessionName")}
          display={this.state.endPromptDisplay}
          toggleEndPromp={this.toggleEndPromp}
        />
        <div id="groupsList"></div>
        <button id="fixed-end" onClick={this.toggleEndPromp}>
          End Game
        </button>
      </div>
    );
  }
}
GroupPage.propTypes = {
  toggleSession: PropTypes.func.isRequired,
};
