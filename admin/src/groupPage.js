import React  from "react";

import search from "./images/Search.svg"
import add_round from "./images/Add_round.svg"
import arrow_left from "./images/Arrow_left.svg"
import Date_range from "./images/Date_range.svg"
import Alarmclock_grey from "./images/Alarmclock_grey.svg"
import Expand_left_double from "./images/Expand_left_double.svg"
import Expand_left from "./images/Expand_left.svg"
import Expand_right from "./images/Expand_right.svg"
import Expand_right_double from "./images/Expand_right_double.svg"

import link from './images/link.svg';
export default class GroupPage extends React.Component {
    constructor(props){
        super(props)
        this.state={
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
        }
    }
    displayGroups = (list)=>{
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
    componentDidMount(){
      let groupList = this.props.getItem("groupList")
      if (groupList){
        this.displayGroups(groupList)
        this.setState({groupList:groupList})
      }else{
        fetch("http://localhost:3003/groups", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"sessionid":Number.parseInt(sessionStorage.getItem("currentSessionID"))})
          })
        .then(response => {
            return response.json()
        })   
        .then(data => {
          // Handle the response data
          console.log(data);
          this.displayGroups(data)
          this.props.setItem({"groupList":data})
          this.setState({groupList:data})
        })
      }
    }
    render(){
      return(
      <div id="groupPage">
      <div id="topBar">

        <div id="top">
          <button id="back" onClick={this.props.toggleSession} value="sessionViewer"><img src={arrow_left} alt="back arrow"/></button>
          <div id="searchDiv">
            <img src={search} alt="search icon" />
            <input type="text" id="searchBar" />
          </div>
          <button id="create" onClick={this.props.toggleSession} value="createGroupPage">
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
    )}
}