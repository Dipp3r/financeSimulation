import React from "react";
import coin from './images/coin.svg';
import downIcon from './images/Download.svg';
import link from './images/link.svg';
import trash from './images/Trash.svg';
import search from "./images/Search.svg"
import add_round from "./images/Add_round.svg"
import arrow_left from "./images/Arrow_left.svg"
import grad_checkbox from "./images/grad_checkbox.svg"
import close from "./images/Close.svg"
import Date_range from "./images/Date_range.svg"
import Alarmclock_grey from "./images/Alarmclock_grey.svg"
import Expand_left_double from "./images/Expand_left_double.svg"
import Expand_left from "./images/Expand_left.svg"
import Expand_right from "./images/Expand_right.svg"
import Expand_right_double from "./images/Expand_right_double.svg"


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
      createGroupMenu: "none",
      groupPage: "none",
      playersPage: "none",
      newSessionName: "",
      newGroupName: "",
    };
    this.displaySessions = this.displaySessions.bind(this);
    this.changeInVal = this.changeInVal.bind(this);
    this.createSession = this.createSession.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.toggleCreateSessionMenu = this.toggleCreateSessionMenu.bind(this);
    this.toggleCreateGroupMenu = this.toggleCreateGroupMenu.bind(this);
    this.toggleGroupPage = this.toggleGroupPage.bind(this);
    this.togglePlayersPage = this.togglePlayersPage.bind(this);
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
        linkButton.onclick = this.togglePlayersPage;
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

  toggleCreateGroupMenu() {
    let temp = "none";
    if (this.state.createGroupMenu == "none") {
      temp = "flex";
    }
    this.setState({ createGroupMenu: temp });
  }

  toggleGroupPage() {
    let temp = "none";
    if (this.state.groupPage == "none") {
      temp = "flex";
    }
    this.setState({ groupPage: temp });
  }

  togglePlayersPage() {
    let temp = "none";
    this.setState({groupPage:"none"});
    if (this.state.groupPage == 'none'){
      this.setState({groupPage: "flex"});
    }
    if (this.state.playersPage == "none") {
      temp = "flex";
    }
    this.setState({ playersPage: temp });
  }

  createSession() {
    console.log(this.state.newSessionName);
  }
  createGroup() {
    console.log(this.state.newGroupName);
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
              <img src={search} alt="search icon" />
              <input type="text" id="searchBar" />
            </div>
            <button id="create" onClick={this.toggleCreateSessionMenu}>
              <div>
                <img src={add_round} alt="add" />
                <p>Create Session</p>
              </div>
            </button>
          </div>
          <div id="sessionList">

          </div>
        </div>

        <div id="playersPage" style={{ display: this.state.playersPage }}>
          <div id="topBar">
            <div id="top">
              <button id="back" onClick={this.togglePlayersPage}><img src={arrow_left} alt="back arrow"/></button>
              <div id="topLabel">
                <div>
                  <p id="groupNum">Group 10</p>
                  <p id="players">Players <a id="playerCount">04</a></p>
                </div>
                <div>
                  <button id="trash">
                    <img src={trash} alt="trashIcon"/>
                  </button>
                  <button>
                    <img src={link} alt="linkIcon"/>
                  </button>
                </div>
              </div>
            </div>
            <hr/>
          </div>
          <div id="playersList">
            <div class="row">
              <button>
                <img src={grad_checkbox} alt="checkbox"/>
                <input type="checkbox" class="checkbox-round" />
              </button>
              <p>Rajesh</p>
              <p>9443650124</p>
              <select name="role" placeholder="Select" id="role">
                <option id="select" value="-1" disabled selected>Select</option>
                <option value="0">Executive</option>
                <option value="1">Accountant</option>
                <option value="2">Analyst</option>
              </select>
              <button id="remove">remove</button>
            </div>

            <div class="row">
              <button>
                <img src={grad_checkbox} alt="checkbox"/>
                <input type="checkbox" class="checkbox-round" />
              </button>
              <p>Rajesh</p>
              <p>9443650124</p>
              <select name="role" placeholder="Select" id="role">
                <option id="select" value="-1" disabled selected>Select</option>
                <option value="0">Executive</option>
                <option value="1">Accountant</option>
                <option value="2">Analyst</option>
              </select>
              <button id="remove">remove</button>
            </div>

            <div class="row">
              <button>
                <img src={grad_checkbox} alt="checkbox"/>
                <input type="checkbox" class="checkbox-round" />
              </button>
              <p>Rajesh</p>
              <p>9443650124</p>
              <select name="role" placeholder="Select" id="role">
                <option id="select" value="-1" disabled selected>Select</option>
                <option value="0">Executive</option>
                <option value="1">Accountant</option>
                <option value="2">Analyst</option>
              </select>
              <button id="remove">remove</button>
            </div>
          </div>
        </div>

        <div id="createSessionPage" style={{ display: this.state.createSessionMenu }}>
          <div id="createSessionMenu">
            <div>
              <p>Session name</p>
              <button id="close" onClick={this.toggleCreateSessionMenu}> <img src={close} alt="close icon"/> </button>
            </div>
            <input
              onChange={this.changeInVal}
              name="newSessionName"
              placeholder="Enter session name"
            />
            <button id="save" onClick={this.createSession}>Save</button>
          </div>
        </div>

        <div id="createGroupPage" style={{ display: this.state.createGroupMenu }}>
          <div id="createGroupMenu">
            <div>
              <p>Group name</p>
              <button id="close" onClick={this.toggleCreateGroupMenu}> <img src={close} alt="close icon"/> </button>
            </div>
            <input
              onChange={this.changeInVal}
              name="newGroupName"
              placeholder="Enter Group name"
            />
            <div id="groupLimit">
              <p>Group limit</p>
              <select name="limit" id="limitBox">
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
            </div>
            <button id="save" onClick={this.createGroup}>Save</button>
          </div>
        </div>

        <div id="groupPage" style={{ display: this.state.groupPage }}>
          <div id="topBar">

            <div id="top">
              <button id="back" onClick={this.toggleGroupPage}><img src={arrow_left} alt="back arrow"/></button>
              <div id="searchDiv">
                <img src={search} alt="search icon" />
                <input type="text" id="searchBar" />
              </div>
              <button id="create" onClick={this.toggleCreateGroupMenu}>
                <div>
                  <img src={add_round} alt="add" />
                  <p>Create Group</p>
                </div>
              </button>
            </div>

            <div id="second">
              <div id="navBar">
               <div id="portion1">
                <div class="navComp">
                    <img src={Date_range} alt="Date_range"/>
                    <p>2100</p>
                  </div>
                  <p>|</p>
                  <div>
                    <p>open phase</p>
                  </div>
                  <p>|</p>
                  <div class="navComp">
                    <img src={Alarmclock_grey} alt="alarmclock"/>
                    <p>5:00</p>
                  </div>
               </div>
                <div id="navigate">
                  <button><img src={Expand_left_double} alt="expand left"/></button>
                  <button><img src={Expand_left} alt="left"/></button>
                  <button><img src={Expand_right} alt="right"/></button>
                  <button><img src={Expand_right_double} alt="expand right"/></button>
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
