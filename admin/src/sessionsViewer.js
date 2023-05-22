import React  from "react";

import search from "./images/Search.svg"
import add_round from "./images/Add_round.svg"
import coin from './images/coin.svg';
import downIcon from './images/Download.svg';

export default class SessionsViewer extends React.Component {
    constructor(props){
        super(props)
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
          ]
        }
        
    }
    displaySessions = (list)=>{
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
          card.onclick = this.props.toggleSession;
          console.log(card)
          card.value = "groupPage"
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
    }
    componentDidMount(){
      let sessionsList = this.props.getItem("sessionsList")
      if (sessionsList){
        this.displaySessions(sessionsList)
        this.setState({"sessionsList":sessionsList})
      }else{
        fetch("http://localhost:3003/sessions", {
          method: 'GET'
        })
        .then(response => {
            return response.json()
        })   
        .then(data => {
          // Handle the response data
          console.log(data);
          this.displaySessions(data)
          this.props.setItem("sessionsList",data)
          this.setState({"sessionsList":data})
        })
      }
    }
    render(){
      console.log(this.props)
      return(
        <div id="sessionsViewer">
          <div id="top">
            <div id="searchDiv">
              <img src={search} alt="search icon" />
              <input type="text" id="searchBar" />
            </div>
            <button id="create" onClick={this.props.toggleSession} value="createSessionPage">
              <div>
                <img src={add_round} alt="add" />
                <p>Create Session</p>
              </div>
            </button>
          </div>
          <div id="sessionList">

          </div>
        </div>
    )}
}