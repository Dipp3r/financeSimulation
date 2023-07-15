import React from "react";
import PropTypes from "prop-types";
import close from "@assets/images/Close.svg";

export default class CreateGroupPage extends React.Component {
  constructor(props) {
    super(props);
  }
  createGroup = () => {
    //required data => name, limit, sessionid
    let obj = {
      limit: Number.parseInt(document.querySelector("#limitBox").value),
      sessionid: Number.parseInt(localStorage.getItem("currentSessionID")),
      name: document.querySelector("#groupName").value,
    };
    fetch(import.meta.env.VITE_API_SERVER_URL + "addGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          this.props.toggleSession("groupPage");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data
        console.log(data);
      });
  };
  render() {
    return (
      <div id="createGroupPage">
        <div id="createGroupMenu">
          <div>
            <p>Group name</p>
            <button
              id="close"
              onClick={this.props.toggleSession}
              value="groupPage"
            >
              <img src={close} alt="close icon" />
            </button>
          </div>
          <input
            name="newGroupName"
            placeholder="Enter Group name"
            id="groupName"
          />
          <div id="groupLimit">
            <p>Group limit</p>
            <select name="limit" id="limitBox">
              <option value="10" defaultValue={"10"}>
                10
              </option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
          <button id="save" onClick={this.createGroup}>
            Save
          </button>
          <div id="buttonBg"></div>
        </div>
      </div>
    );
  }
}

CreateGroupPage.propTypes = {
  toggleSession: PropTypes.func.isRequired,
};
