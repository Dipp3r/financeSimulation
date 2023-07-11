import React from "react";
import PropTypes from "prop-types";
import { WithRouter } from "@components/routingWrapper";
import alert from "@assets/images/alert_white.svg";
import "@assets/styles/delete.scss";

class RemovedComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: "",
    };
  }
  componentDidMount() {
    this.setState(JSON.parse(localStorage.getItem("removedMsg")));
  }
  render() {
    return (
      <>
        <div id="removePg">
          <div id="main">
            <div id="topDiv">
              <img src={alert} alt="alert icon" />
            </div>
            <div id="content">
              <p id="alert">Alert!</p>
              {this.state.userid ? (
                <p id="msg">
                  {" "}
                  {this.state.name}, you have been removed by the admin.
                </p>
              ) : (
                <p id="msg">{this.state.reason}</p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

RemovedComp.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default WithRouter(RemovedComp);
