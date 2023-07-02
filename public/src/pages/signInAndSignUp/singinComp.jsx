import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/signup.scss";
import coin from "@assets/images/coin.svg";
// import FormLogin from "@components/loginForm";
import Arrow_left from "@assets/images/backArrow.png";

import validator from "@utils/validator";
class SigninComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordError: "",
      mobileError: "",
    };
  }
  // componentDidMount() {
  //   if (
  //     localStorage.getItem("userid") &&
  //     localStorage.getItem("groupid") == window.location.href.split("/").pop()
  //   )
  //     this.props.toggleMainDisplay("dashboard");

  //   let groupid = window.location.href.split("/").pop();
  //   localStorage.setItem("groupid", groupid);
  // }
  submit = () => {
    let formElements = document
      .querySelector(".form")
      .querySelectorAll("input");
    let obj = {};
    let error = {};
    let isError = false;
    formElements.forEach((element) => {
      obj[element.name] = element.value;
      error[`${element.name}Error`] = ``;
      if (element.value.trim() == "") {
        error[`${element.name}Error`] = `*This field is Required`;
        isError = true;
      }
    });
    console.log(error, isError);
    let vali = validator({ ...obj });
    console.log(vali);
    for (let element in vali) {
      error[`${element}Error`] =
        vali[element] || error[`${element}Error`] != ""
          ? error[`${element}Error`]
          : `invalid ${element}`;
      isError = isError || !vali[element];
      console.log(element, isError);
    }
    console.log(isError);
    if (!isError) {
      fetch(
        import.meta.env.VITE_API_SERVER_URL +
          "login/" +
          localStorage.getItem("groupid"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          } else {
            throw new Error();
          }
        })
        .then((data) => {
          for (let i in data) {
            localStorage.setItem(i, data[i]);
          }
          this.props.toggleMainDisplay("dashboard");
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      console.log(error);
      this.setState(error);
    }
  };
  render() {
    return (
      <div id="login">
        <div id="portion1">
          <div id="description">
            <p>Login</p>
            <p>to</p>
            <p>play</p>
          </div>
          <img src={coin} alt="coin" />
        </div>
        <div className="form">
          <input
            className="formInput"
            type="text"
            name="mobile"
            placeholder="Mobile number"
            // value={formData.mobile}
            // onChange={handleInputChange}
          />
          <p className="error">{this.state.mobileError}</p>
          <input
            className="formInput"
            type="password"
            name="password"
            placeholder="Create Password"
            // value={formData.password}
            // onChange={handleInputChange}
          />
          <p className="error">{this.state.passwordError}</p>
          <div>
            <button id="loginButton" onClick={this.props.toggleInitPage}>
              <img src={Arrow_left} />
              signup
            </button>
            <button id="loginButton" onClick={this.submit}>
              login
            </button>
          </div>
        </div>
      </div>
    );
  }
}
SigninComp.propTypes = {
  toggleInitPage: PropTypes.func.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default SigninComp;
