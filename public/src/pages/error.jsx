import React from "react";
// import PropTypes from "prop-types";
// import { WithRouter } from "@components/routingWrapper";

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
        <p>
          404 page not found <br />
          try reloading again
        </p>
      </>
    );
  }
}

export default ErrorComp;
