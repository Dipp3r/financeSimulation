import React  from "react";

import close from "./images/Close.svg"

export default class CreateSessionPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    createSession = ()=>{
      let value = document.querySelector("#newSessionName").value
      fetch("http://localhost:3003/createSession", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"title":value})
          })
            .then(response => {
                if(response.status == 200 || response.status == 201) {
                    // this.props.toggleMainDisplay("dashboard")
                }
                return response.json()
            })   
            .then(data => {
              // Handle the response data
              console.log(data);
            })
      console.log(value)
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
          id="newSessionName"
          placeholder="Enter session name"
        />
        <button id="save" onClick={this.createSession}>Save</button>
      </div>
    </div>
    )}
}