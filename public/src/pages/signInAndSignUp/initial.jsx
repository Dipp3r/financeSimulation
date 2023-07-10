import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/signup.scss";
import "@assets/styles/signupForm.scss";

import SigninComp from "./singinComp";
import SignupComp from "./signupComp";
import { WithRouter } from "@components/routingWrapper";
// const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class InitialComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignin: true,
      notificationList: [],
    };
  }
  toggleInitPage = () => {
    let isSignin = !this.state.isSignin;
    console.log(isSignin);
    this.setState({ isSignin: isSignin });
  };
  componentDidMount() {
    if (
      localStorage.getItem("userid") &&
      localStorage.getItem("groupid") == window.location.href.split("/").pop()
    ) {
      this.props.navigate("../" + localStorage.getItem("mainDisplay"));
    } else {
      let groupid = window.location.href.split("/").pop();
      localStorage.setItem("groupid", groupid);
    }
  }
  render() {
    return (
      <>
        {this.state.isSignin ? (
          <SigninComp toggleInitPage={this.toggleInitPage} />
        ) : (
          <SignupComp toggleInitPage={this.toggleInitPage} />
        )}
      </>
    );
  }
}
InitialComp.propTypes = {
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
export default WithRouter(InitialComp);
