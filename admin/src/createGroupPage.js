import React  from "react";

import close from "./images/Close.svg"

export default class CreateGroupPage extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
      return(
      <div id="createGroupPage">
      <div id="createGroupMenu">
        <div>
          <p>Group name</p>
          <button id="close" onClick={this.props.toggleSession} value="groupPage"> <img src={close} alt="close icon"/> </button>
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
    )}
}