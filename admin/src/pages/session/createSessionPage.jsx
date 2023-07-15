import React from "react";
import PropTypes from "prop-types";
import close from "@assets/images/Close.svg";

export default class CreateSessionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createSession = () => {
    let value = document.querySelector("#newSessionName").value;
    fetch(import.meta.env.VITE_API_SERVER_URL + "createSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: value }),
    }).then((response) => {
      if (response.status == 200 || response.status == 201) {
        this.props.toggleSession("sessionViewer");
      }
      return response.json();
    });
  };
  render() {
    return (
      <div id="createSessionPage">
        <div id="createSessionMenu">
          <div>
            <p>Session name</p>
            <button
              id="close"
              onClick={this.props.toggleSession}
              value="sessionViewer"
            >
              <img src={close} alt="close icon" />
            </button>
          </div>
          <input id="newSessionName" placeholder="Enter session name" />
          <button id="save" onClick={this.createSession}>
            Save
          </button>
          <div id="buttonBg"></div>
        </div>
      </div>
    );
  }
}
CreateSessionPage.propTypes = {
  toggleSession: PropTypes.func.isRequired,
};
