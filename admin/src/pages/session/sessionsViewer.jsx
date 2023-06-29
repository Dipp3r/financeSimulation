import React from "react";
import PropTypes from "prop-types";
import search from "@assets/images/Search.svg";
import add_round from "@assets/images/Add_round.svg";
import coin from "@assets/images/coin.svg";
import downIcon from "@assets/images/Download.svg";

export default class SessionsViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionsList: [],
    };
  }
  displaySessions = (list) => {
    let container = document.querySelector("#sessionList");
    container.innerHTML = "";
    if (list.length > 0) {
      let card,
        nameDiv,
        coinIcon,
        name,
        infoDiv,
        groupBox,
        playerBox,
        groupLabel,
        playerLabel,
        groupInfo,
        playerInfo,
        excelDownload,
        downloadIcon;
      for (let session of list) {
        card = document.createElement("button");
        console.log(session.sessionid);
        card.onclick = () => {
          this.props.toggleSession("groupPage");
          sessionStorage.setItem("currentSessionID", session.sessionid);
        };
        // console.log(card)
        card.value = "groupPage";
        card.className = "sessionCards";
        nameDiv = document.createElement("div");
        nameDiv.id = "nameDiv";
        name = document.createElement("p");
        name.id = "name";
        coinIcon = document.createElement("img");
        coinIcon.src = coin;
        coinIcon.alt = "coin";
        nameDiv.appendChild(coinIcon);
        nameDiv.appendChild(name);

        infoDiv = document.createElement("div");
        infoDiv.id = "infoDiv";
        groupBox = document.createElement("div");

        playerBox = document.createElement("div");

        groupLabel = document.createElement("p");
        groupLabel.id = "groupLabel";
        groupLabel.innerText = "Groups";
        groupInfo = document.createElement("p");
        groupInfo.id = "groupInfo";
        playerLabel = document.createElement("p");
        playerLabel.id = "playerLabel";
        playerLabel.innerText = "Players";
        playerInfo = document.createElement("p");
        playerInfo.id = "playerInfo";
        groupBox.appendChild(groupLabel);
        groupBox.appendChild(groupInfo);

        playerBox.appendChild(playerLabel);
        playerBox.appendChild(playerInfo);

        excelDownload = document.createElement("button");
        downloadIcon = document.createElement("img");
        downloadIcon.src = downIcon;
        excelDownload.innerText = "download";
        excelDownload.appendChild(downloadIcon);
        excelDownload.style = "margin-left:50px;";
        infoDiv.appendChild(groupBox);
        infoDiv.appendChild(playerBox);
        infoDiv.appendChild(downloadIcon);
        card.appendChild(nameDiv);
        card.appendChild(infoDiv);

        name.innerText = session.title;
        groupInfo.innerText = session.groups;
        playerInfo.innerText = session.players;

        container.appendChild(card);
      }
    } else {
      let p = document.createElement("p");
      p.innerText = "no sessions";
      container.appendChild(p);
    }
  };
  searchSession = (e) => {
    let list = this.state.sessionsList;
    console.log(list);
    if (e.currentTarget.value == "") {
      this.displaySessions(list);
    }
    let reg = new RegExp(e.currentTarget.value, "i");
    list = list.filter((session) => {
      return reg.test(session.title);
    });
    this.displaySessions(list);
  };
  componentDidMount() {
    let sessionsList = this.props.getItem("sessionsList");
    if (sessionsList) {
      this.displaySessions(sessionsList);
      this.setState({ sessionsList: sessionsList });
    } else {
      fetch(import.meta.env.VITE_API_SERVER_URL + "sessions", {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // Handle the response data
          console.log(data);
          this.displaySessions(data);
          this.props.setItem({ sessionsList: data });
          this.setState({ sessionsList: data });
        });
    }
  }
  render() {
    console.log(this.state);
    return (
      <div id="sessionsViewer">
        <div id="top">
          <div id="searchDiv">
            <img src={search} alt="search icon" />
            <input type="text" id="searchBar" onChange={this.searchSession} />
          </div>
          <button
            id="create"
            onClick={this.props.toggleSession}
            value="createSessionPage"
          >
            <div>
              <img src={add_round} alt="add" />
              <p>Create Session</p>
            </div>
          </button>
        </div>
        <div id="sessionList"></div>
      </div>
    );
  }
}
SessionsViewer.propTypes = {
  toggleSession: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
