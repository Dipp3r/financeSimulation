import React  from "react";

import close from "./images/Close.svg"

export default class CreateSessionPage extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
      return(
      <div id="createSessionPage">
      <div id="createSessionMenu">
        <div>
          <p>Session name</p>
          <button id="close" onClick={this.props.toggleSession} value="sessionViewer" > <img src={close} alt="close icon"/> </button>
        </div>
        <input
          onChange={this.changeInVal}
          name="newSessionName"
          placeholder="Enter session name"
        />
        <button id="save" onClick={this.createSession}>Save</button>
      </div>
    </div>
    )}
}