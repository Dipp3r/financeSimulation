import React from "react";
// import PropTypes from "prop-types";
// import { WithRouter } from "@components/routingWrapper";
import error from "@assets/images/error.svg";
import "@assets/styles/error.scss";

class ErrorComp extends React.Component {
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
        <div id="error">
          <div id="content">
            <img src={error} alt="404 page not found" />
            <p>
              This page is a result of an invalid URL. Try entering a valid url
              or contact the admin for help.
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default ErrorComp;
