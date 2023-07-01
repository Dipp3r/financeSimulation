import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/signup.scss";
import coin from "@assets/images/coin.svg";
import FormSignup from "@components/signupForm";

class SignupComp extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (
      localStorage.getItem("userid") &&
      localStorage.getItem("groupid") == window.location.href.split("/").pop()
    )
      this.props.toggleMainDisplay("dashboard");

    let groupid = window.location.href.split("/").pop();
    localStorage.setItem("groupid", groupid);
  }
  render() {
    return (
      <div id="login">
        <div id="portion1">
          <div id="description">
            <p>Sign Up</p>
            <p>to</p>
            <p>play</p>
          </div>
          <img src={coin} alt="coin" />
        </div>
        <FormSignup
          toggleMainDisplay={this.props.toggleMainDisplay}
        ></FormSignup>
      </div>
    );
  }
}
SignupComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default SignupComp;
