import React from "react";
import PropTypes from "prop-types";

import search from "@assets/images/Search.svg";
import add_round from "@assets/images/Add_round.svg";
import arrow_left from "@assets/images/Arrow_left.svg";
import Date_range from "@assets/images/Date_range.svg";
import Alarmclock_grey from "@assets/images/Alarmclock_grey.svg";
import Expand_left_double from "@assets/images/Expand_left_double.svg";
import Expand_left from "@assets/images/Expand_left.svg";
import Expand_right from "@assets/images/Expand_right.svg";
import Expand_right_double from "@assets/images/Expand_right_double.svg";
import link from "@assets/images/link.svg";

export default class GroupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
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
    container.innerHTML = "";
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
        linkButton.onclick = this.togglePlayersPage;
        linkIcon = document.createElement("img");
        linkIcon.src = link;
        groupBox.appendChild(groupInfo);
        linkButton.appendChild(linkIcon);
        linkButton.onclick = (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(
            import.meta.env.VITE_API_PUBLIC_URL + `/${group.groupid}`
          );
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
    }
  };
  fetchGroupList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionid: Number.parseInt(sessionStorage.getItem("currentSessionID")),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Handle the response data
        console.log(data);
        this.displayGroups(data);
        // this.props.setItem({ groupList: data });
        this.setState({ groupList: data });
      });
  };
  componentDidMount() {
    // let groupList = this.props.getItem("groupList")
    // if (groupList && groupList.length > 0){
    //   this.displayGroups(groupList)
    //   this.setState({groupList:groupList})
    // } else {
    this.fetchGroupList();
    // }
  }
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
              <div>
                <img id="add" src={add_round} alt="add" />
                <p>Create Group</p>
              </div>
            </button>
          </div>

          <div id="second">
            <div id="navBar">
              <div id="portion1">
                <div className="navComp">
                  <img src={Date_range} alt="Date_range" />
                  <p>2100</p>
                </div>
                <p>|</p>
                <div>
                  <p>open phase</p>
                </div>
                <p>|</p>
                <div className="navComp">
                  <img src={Alarmclock_grey} alt="alarmclock" />
                  <p>5:00</p>
                </div>
              </div>
              <div id="navigate">
                <button>
                  <img src={Expand_left_double} alt="expand left" />
                </button>
                <button>
                  <img src={Expand_left} alt="left" />
                </button>
                <button>
                  <img src={Expand_right} alt="right" />
                </button>
                <button>
                  <img src={Expand_right_double} alt="expand right" />
                </button>
              </div>
            </div>
            <button id="gameStatus">Start</button>
          </div>
        </div>

        <div id="groupsList"></div>
      </div>
    );
  }
}
GroupPage.propTypes = {
  toggleSession: PropTypes.func.isRequired,
};
