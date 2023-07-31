import React from "react";
import ReactDOM from "react-dom/client";
import EditComp from "@pages/edit/edit.jsx";
// import { HashRouter } from 'react-router-dom'
// import { BrowserRouter, Routes, Route ,useNavigate} from "react-router-dom";
import SessionsComp from "@pages/session/sessions.jsx";
import "@assets/styles/home.scss";
import Group from "@assets/images/Group.svg";
import Edit from "@assets/images/Edit.svg";
import Edit_white from "@assets/images/Edit_white.svg";
import Group_white from "@assets/images/Group_white.svg";
import vittae_logo_color from "@assets/images/vittae_logo_color.svg";
import illustration from "@assets/images/illustration.svg";
import coin from "@assets/images/coin.svg";

const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class IndexComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainPage: 1,
      mainPageValue: 1,
      isAuth: false,
    };
    this.getItem = this.getItem.bind(this);
    this.setItem = this.setItem.bind(this);
    this.toggleMainPage = this.toggleMainPage.bind(this);
  }
  getItem(key) {
    return this.state[key];
  }
  setItem(obj) {
    this.setState(obj);
  }
  toggleMainPage(value) {
    value ||= "edit";
    let mainPage;

    let options = document.querySelector("#options").childNodes;

    options.forEach((element) => {
      element.style.background = "transparent";
      element.style.color = "#223F80";
      element.className = "button";
    });
    switch (value) {
      case "session":
      default:
        mainPage = (
          <SessionsComp setItem={this.setItem} getItem={this.getItem} />
        );
        document.querySelector("#imgGroup").src = Group_white;
        document.querySelector("#imgEdit").src = Edit;
        break;
      case "edit":
        mainPage = <EditComp setItem={this.setItem} getItem={this.getItem} />;
        document.querySelector("#imgEdit").src = Edit_white;
        document.querySelector("#imgGroup").src = Group;
        break;
    }
    options[value == "edit" ? 0 : 1].className = "button buttonActive";
    options[value == "edit" ? 0 : 1].style.backgroundColor = "#223f80";
    options[value == "edit" ? 0 : 1].style.color = "#FFF";
    this.setState({ mainPage: mainPage, mainPageValue: value });
    localStorage.setItem("mainPageValue", value);
  }
  componentDidMount() {
    socket.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });
    this.checkAuth();
  }
  checkAuth = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "authAdmin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `brear ${localStorage.getItem("accessToken")}`,
      },
    }).then((response) => {
      if (response.status == 200) {
        this.setState({ isAuth: true }, () => {
          this.toggleMainPage(localStorage.getItem("mainPageValue"));
        });
      } else {
        this.setState({ isAuth: false });
        // document.querySelector("#passwordInput").style.borderColor = "red";
      }
    });
  };

  submitPassword = () => {
    let obj = {};
    obj.password = document.querySelector("#passwordInput").value.trim();
    console.log(!obj.password);
    if (!obj.password || obj.password == "") {
      document.querySelector("#passwordInput").style.borderColor = "red";
      return;
    }
    fetch(import.meta.env.VITE_API_SERVER_URL + "adminLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        if (response.status == 200) return response.json();
        document.querySelector("#passwordInput").style.borderColor = "red";
        throw new Error();
      })
      .then((data) => {
        localStorage.setItem("accessToken", data.accessToken);
        this.setState({ isAuth: true }, () => {
          this.toggleMainPage(localStorage.getItem("mainPageValue"));
        });
      });
  };
  render() {
    if (this.state.isAuth) {
      return (
        <section id="home">
          <nav id="sideBar">
            <img src={vittae_logo_color} alt="vittae logo" />
            <div id="options">
              <div
                className="button"
                onClick={() => {
                  this.toggleMainPage("edit");
                }}
              >
                <img id="imgEdit" src={Edit} alt="editIcon" />
                <p>Edit</p>
              </div>
              <div
                className="button"
                onClick={() => {
                  this.toggleMainPage("session");
                }}
              >
                <img id="imgGroup" src={Group} alt="groupIcon" />
                <p>Sessions</p>
              </div>
            </div>
            <img id="tree" src={illustration} alt="tree illustration" />
          </nav>
          <div id="main">
            {this.state.mainPage}
            {/* <SessionsComp /> */}
          </div>
        </section>
      );
    } else {
      return (
        <section id="home">
          <img id="tree1" src={illustration} alt="tree illustration" />
          <div id="login">
            <p id="title1">Finance</p>
            <div id="title2">
              <p>Simulator</p>
              <img src={coin} alt="coin" />
            </div>
            <div id="loginForm">
              <input
                type="password"
                id="passwordInput"
                onInput={() => {
                  document.querySelector("#passwordInput").style.borderColor =
                    "black";
                }}
                placeholder="Password"
              />
              <button onClick={this.submitPassword}>Submit</button>
            </div>
          </div>
        </section>
      );
    }
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexComp />);
