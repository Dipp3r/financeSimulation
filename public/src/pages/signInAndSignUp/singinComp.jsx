import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/signup.scss";
import coin from "@assets/images/coin.svg";
// import FormLogin from "@components/loginForm";
import Arrow_left from "@assets/images/backArrow.png";

import validator from "@utils/validator";
import { WithRouter } from "@components/routingWrapper";
class SigninComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordError: "",
      mobileError: "",
    };
  }
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
        import.meta.env.VITE_API_SERVER_URL + "login/" + this.props.groupid,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      )
        .then(async (response) => {
          if (response.status == 200) {
            return response.json();
          } else {
            let data = await response.json();
            this.setState({ passwordError: data.msg });
            throw new Error();
          }
        })
        .then((data) => {
          localStorage.setItem("groupid", this.props.groupid);
          for (let i in data) {
            localStorage.setItem(i, data[i]);
          }
          if (!localStorage.getItem("minute"))
            localStorage.setItem("minute", 15);
          if (!localStorage.getItem("second"))
            localStorage.setItem("second", 0);
          this.props.navigate("../../");
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
            placeholder="Password"
            // value={formData.password}
            // onChange={handleInputChange}
          />
          <p className="error">{this.state.passwordError}</p>
          <div>
            <button onClick={this.props.toggleInitPage}>
              <img src={Arrow_left} />
              Sign up
            </button>
            <button id="loginButton" onClick={this.submit}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
}
SigninComp.propTypes = {
  toggleInitPage: PropTypes.func.isRequired,
  groupid: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};
export default WithRouter(SigninComp);
