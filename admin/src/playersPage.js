import React  from "react";

import link from './images/link.svg';
import trash from './images/Trash.svg';
import arrow_left from "./images/Arrow_left.svg"
import grad_checkbox from "./images/grad_checkbox.svg"

export default class PlayersPage extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
      return(
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
    )}
}