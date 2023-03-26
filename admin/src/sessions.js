import React from "react";
import coin from './images/coin.svg';
import downIcon from './images/Download.svg';
import link from './images/link.svg';

class SessionsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionsList: [
        {
          id: 1,
          name: "SSN College | IT Dept",
          groupsCount: 50,
          playersCount: 600,
        },
        {
          id: 2,
          name: "Vels university | MBA dept",
          groupsCount: 12,
          playersCount: 120,
        },
        {
          id: 123,
          name: "YYY clg | YYY dept",
          groupsCount: 100,
          playersCount: 1000,
        },
      ],
      groupList: [
        { id: 1, playersCount: 10 },
        { id: 2, playersCount: 15 },
        { id: 3, playersCount: 18 },
        { id: 4, playersCount: 8 },
        { id: 5, playersCount: 5 },
        { id: 6, playersCount: 10 },
        { id: 7, playersCount: 15 },
        { id: 8, playersCount: 18 },
        { id: 9, playersCount: 8 },
        { id: 10, playersCount: 5 },
      ],
      createSessionMenu: "none",
      groupPage: "none",
      newSessionName: "",
    };
    this.displaySessions = this.displaySessions.bind(this);
    this.changeInVal = this.changeInVal.bind(this);
    this.createSession = this.createSession.bind(this);
    this.toggleCreateSessionMenu = this.toggleCreateSessionMenu.bind(this);
    this.toggleGroupPage = this.toggleGroupPage.bind(this);
    this.displayGroups = this.displayGroups.bind(this);
  }
  changeInVal(e) {
    let obj = {};
    obj[e.currentTarget.name] = e.currentTarget.value;
    this.setState(obj);
  }
  displaySessions(list) {
    let container = document.querySelector("#sessionList");
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
        card.onclick = this.toggleGroupPage;
        card.className = "sessionCards"
        nameDiv = document.createElement("div");
        nameDiv.id="nameDiv"
        name = document.createElement("p");
        name.id = "name"
        coinIcon = document.createElement("img")
        coinIcon.src = coin;
        coinIcon.alt = 'coin';
        nameDiv.appendChild(coinIcon);
        nameDiv.appendChild(name);

        infoDiv = document.createElement("div");
        infoDiv.id="infoDiv"
        groupBox = document.createElement("div");
        
        playerBox = document.createElement("div");

        groupLabel = document.createElement("p");
        groupLabel.id = "groupLabel"
        groupLabel.innerText = "Groups";
        groupInfo = document.createElement("p");
        groupInfo.id = "groupInfo"
        playerLabel = document.createElement("p");
        playerLabel.id = "playerLabel"
        playerLabel.innerText = "Players";
        playerInfo = document.createElement("p");
        playerInfo.id = "playerInfo"
        groupBox.appendChild(groupLabel);
        groupBox.appendChild(groupInfo);

        playerBox.appendChild(playerLabel);
        playerBox.appendChild(playerInfo);

        excelDownload = document.createElement("button");
        downloadIcon = document.createElement("img");
        downloadIcon.src= downIcon;
        excelDownload.innerText = "download";
        excelDownload.appendChild(downloadIcon);
        excelDownload.style= "margin-left:50px;"
        infoDiv.appendChild(groupBox);
        infoDiv.appendChild(playerBox);
        infoDiv.appendChild(downloadIcon);
        card.appendChild(nameDiv);
        card.appendChild(infoDiv);

        name.innerText = session.name;
        groupInfo.innerText = session.groupsCount;
        playerInfo.innerText = session.playersCount;

        container.appendChild(card);
      }
    } else {
      let p = document.createElement("p");
      p.innerText = "no sessions";
      container.appendChild(p);
    }
  }
  displayGroups(list) {
    let container = document.querySelector("#groupsList");
    container.innerHTML = "";
    if (list.length > 0) {
      let card, groupBox, groupInfo,linkButton,players_count, linkIcon, playerBox;
      for (let group of list) {
        card = document.createElement("div");
        card.className ="card"
        groupBox = document.createElement("div");
        groupBox.id="groupBox"
      
        groupInfo = document.createElement("p");
        groupInfo.id = "groupInfo"
        
        linkButton = document.createElement("button");
        linkIcon = document.createElement("img");
        linkIcon.src = link;
        groupBox.appendChild(groupInfo);
        linkButton.appendChild(linkIcon);
        groupBox.appendChild(linkButton);


        playerBox = document.createElement("p");
        playerBox.style = "display:flex;flex-direction:row;font-family: 'Montserrat';font-style: normal;font-weight: 500;font-size: 18px;color: rgba(34, 63, 128, 0.4);";
        playerBox.id = "playerBox"
        players_count = document.createElement("p");
        players_count.style = "margin-left:15px;font-family: 'Montserrat';font-style: normal;font-weight: 500;font-size: 18px;color: #3F3F3F;"
        players_count.innerText = `${group.playersCount}`;
        groupInfo.innerText = `Group 0${group.id}`;
        playerBox.innerText = 'players';
        playerBox.appendChild(players_count);
        card.appendChild(groupBox);
        card.appendChild(playerBox);
        container.appendChild(card);
      }
    }
  }
  toggleCreateSessionMenu() {
    let temp = "none";
    if (this.state.createSessionMenu == "none") {
      temp = "flex";
    }
    this.setState({ createSessionMenu: temp });
  }
  toggleGroupPage() {
    let temp = "none";
    if (this.state.groupPage == "none") {
      temp = "flex";
    }
    this.setState({ groupPage: temp });
  }
  createSession() {
    console.log(this.state.newSessionName);
  }
  componentDidMount() {
    this.displaySessions(this.state.sessionsList);
    this.displayGroups(this.state.groupList);
  }
  render() {
    return (
      <div id="sessionMain">
        
        <div id="sessionsViewer">
          <div id="top">
            <div id="searchDiv">
              <img src={require("./images/Search.svg")} alt="search icon" />
              <input type="text" id="searchBar" />
            </div>
            <button id="create" onClick={this.toggleCreateSessionMenu}>
              <div>
                <img src={require("./images/Add_round.svg")} alt="add" />
                <p>Create Session</p>
              </div>
            </button>
          </div>
          <div id="sessionList">

          </div>
        </div>
        <div id="createSessionPage" style={{ display: this.state.createSessionMenu }}>
          <div id="createSessionMenu">
            <div>
              <p>Session name</p>
              <button id="close" onClick={this.toggleCreateSessionMenu}> <img src={require("./images/Close.svg")} alt="close icon"/> </button>
            </div>
            <input
              onChange={this.changeInVal}
              name="newSessionName"
              placeholder="Enter session name"
            />
            <button id="save" onClick={this.createSession}>Save</button>
          </div>
        </div>

        <div id="groupPage" style={{ display: this.state.groupPage }}>
          <div id="topBar">

            <div id="top">
              <button id="back" onClick={this.toggleGroupPage}><img src={require("./images/Arrow_left.svg")} alt="back arrow"/></button>
              <div id="searchDiv">
                <img src={require("./images/Search.svg")} alt="search icon" />
                <input type="text" id="searchBar" />
              </div>
              <button id="create" onClick={this.toggleCreateSessionMenu}>
                <div>
                  <img src={require("./images/Add_round.svg")} alt="add" />
                  <p>Create Group</p>
                </div>
              </button>
            </div>

            <div id="second">
              <div id="navBar">
                <div class="navComp">
                  <img src={require("./images/Date_range.svg")} alt="Date_range"/>
                  <p>2100</p>
                </div>
                <p>|</p>
                <div>
                  <p>open phase</p>
                </div>
                <p>|</p>
                <div class="navComp">
                  <img src={require("./images/Alarmclock_grey.svg")} alt="alarmclock"/>
                  <p>5:00</p>
                </div>
                <div id="navigate">
                  <button><img src={require("./images/Expand_left_double.svg")} alt="expand left"/></button>
                  <button><img src={require("./images/Expand_left.svg")} alt="left"/></button>
                  <button><img src={require("./images/Expand_right.svg")} alt="right"/></button>
                  <button><img src={require("./images/Expand_right_double.svg")} alt="expand right"/></button>
                </div>
              </div>
              <button id="gameStatus">Start</button>
            </div>
          </div>

          <div id="groupsList"></div>
        </div>
      </div>
    );
  }
}

export default SessionsComp;
