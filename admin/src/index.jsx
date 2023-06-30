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
class IndexComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainPage: 1,
      mainPageValue: 1,
    };
    this.getItem = this.getItem.bind(this);
    this.setItem = this.setItem.bind(this);
    this.toggleMainPage = this.toggleMainPage.bind(this);
  }
  getItem(key) {
    console.log(this.state[key]);
    return this.state[key];
  }
  setItem(obj) {
    console.log(obj);
    this.setState(obj);
  }
  toggleMainPage(e) {
    let value = e | "1";
    let mainPage;
    if (e) if (e.currentTarget) value = e.currentTarget.getAttribute("value");

    let options = document.querySelector("#options").childNodes;
    console.log(options);

    options.forEach((element) => {
      element.style.background = "transparent";
      element.style.color = "#223F80";
    });
    switch (value) {
      case "1":
      default:
        mainPage = (
          <SessionsComp setItem={this.setItem} getItem={this.getItem} />
        );
        document.querySelector("#imgGroup").src = Group_white;
        document.querySelector("#imgEdit").src = Edit;
        break;
      case "0":
        mainPage = <EditComp />;
        document.querySelector("#imgEdit").src = Edit_white;
        document.querySelector("#imgGroup").src = Group;
        break;
    }
    options[value].style.backgroundColor = "#223f80";
    options[value].style.color = "#FFF";
    this.setState({ mainPage: mainPage, mainPageValue: value });
    sessionStorage.setItem("mainPageValue", value);
  }
  componentDidMount() {
    this.toggleMainPage(sessionStorage.getItem("mainPageValue"));
  }
  render() {
    console.log(this.state);
    return (
      <section id="home">
        <nav id="sideBar">
          <img src={vittae_logo_color} alt="vittae logo" />
          <div id="options">
            <div className="button" value="0" onClick={this.toggleMainPage}>
              <img id="imgEdit" src={Edit} alt="editIcon" />
              <p>Edit</p>
            </div>
            <div className="button" value="1" onClick={this.toggleMainPage}>
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
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexComp />);
