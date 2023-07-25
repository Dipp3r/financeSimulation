import React from "react";
import PropTypes from "prop-types";
// import deleteIcon from "@assets/images/delete.png";
import close from "@assets/images/cross.svg";
export default class EndPrompt extends React.Component {
  endSession = () => {
    let obj = {};
    obj.sessionid = this.props.id;
    let target = document.querySelector("#endPrompt").querySelector("input");
    if (target.value == this.props.name) {
      target.style.borderColor = "black";
      fetch(import.meta.env.VITE_API_SERVER_URL + "end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(obj),
      }).then((response) => {
        if (response.status == 200) this.props.toggleEndPromp();
      });
    } else {
      target.style.borderColor = "red";
    }
  };
  componentDidMount() {
    document.querySelector("#endPrompt").querySelector("input").focus();
  }
  render() {
    return (
      <div id="endPrompt" style={{ display: this.props.display }}>
        <div id="endBox">
          <div id="first">
            <p>End {this.props.name}</p>
            <button id="closeButton" onClick={this.props.toggleEndPromp}>
              <img src={close} alt="" />
            </button>
          </div>
          <hr />
          <div id="third">
            <p>
              To confirm, type {'"' + this.props.name + '"'} in the box below
            </p>
            <input type="text" />
            <button id="endPromptButton" onClick={this.endSession}>
              <p>End this Session</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

EndPrompt.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  toggleEndPromp: PropTypes.func.isRequired,
  display: PropTypes.string.isRequired,
};
