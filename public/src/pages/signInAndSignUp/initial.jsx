import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/signup.scss";
import "@assets/styles/signupForm.scss";

import SigninComp from "./singinComp";
import SignupComp from "./signupComp";

class InitialComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignin: true,
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
      this.props.toggleMainDisplay(localStorage.getItem("mainDisplay"));
    } else {
      let groupid = window.location.href.split("/").pop();
      localStorage.setItem("groupid", groupid);
    }
  }
  render() {
    return (
      <>
        {this.state.isSignin ? (
          <SigninComp
            toggleInitPage={this.toggleInitPage}
            toggleMainDisplay={this.props.toggleMainDisplay}
          />
        ) : (
          <SignupComp
            toggleInitPage={this.toggleInitPage}
            toggleMainDisplay={this.props.toggleMainDisplay}
          />
        )}
      </>
    );
  }
}
InitialComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default InitialComp;
