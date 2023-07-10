import React from "react";
import PropTypes from "prop-types";
import { WithRouter } from "@components/routingWrapper";

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
        {this.state.userid ? (
          <p> {this.state.name}, you have been removed </p>
        ) : (
          <p>{this.state.reason}</p>
        )}
      </>
    );
  }
}
RemovedComp.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default WithRouter(RemovedComp);
