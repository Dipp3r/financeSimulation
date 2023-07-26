import React from "react";
import PropTypes from "prop-types";

import SessionsViewer from "@pages/session/sessionsViewer";
import PlayersPage from "@pages/session/playersPage";
import CreateSessionPage from "@pages/session/createSessionPage";
import CreateGroupPage from "@pages/session/createGroupPage";
import GroupPage from "@pages/session/groupPage";

class SessionsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      displayComp: (
        <SessionsViewer
          toggleSession={this.toggleSession}
          setItem={this.props.setItem}
          getItem={this.props.getItem}
        />
      ),
      createSessionMenu: "none",
      createGroupMenu: "none",
      groupPage: "none",
      playersPage: "none",
      newSessionName: "",
      newGroupName: "",
    };
  }
  toggleSession = (e) => {
    let value =
      typeof e === "string" ? e : e.currentTarget.getAttribute("value");
    let displayComp;
    switch (value) {
      case "sessionViewer":
      default:
        displayComp = (
          <SessionsViewer
            toggleSession={this.toggleSession}
            setItem={this.props.setItem}
            getItem={this.props.getItem}
          />
        );
        break;
      case "playersPage":
        displayComp = (
          <PlayersPage
            toggleSession={this.toggleSession}
            setItem={this.props.setItem}
            getItem={this.props.getItem}
          />
        );
        break;
      case "createSessionPage":
        displayComp = (
          <CreateSessionPage
            toggleSession={this.toggleSession}
            setItem={this.props.setItem}
            getItem={this.props.getItem}
          />
        );
        break;
      case "createGroupPage":
        displayComp = (
          <CreateGroupPage
            toggleSession={this.toggleSession}
            setItem={this.props.setItem}
            getItem={this.props.getItem}
          />
        );
        break;
      case "groupPage":
        displayComp = (
          <GroupPage
            toggleSession={this.toggleSession}
            setItem={this.props.setItem}
            getItem={this.props.getItem}
          />
        );
        break;
    }
    localStorage.setItem("sessionPage", value);
    this.setState({ displayComp: displayComp });
  };
  componentDidMount() {
    let sessionPage = localStorage.getItem("sessionPage");
    this.toggleSession(sessionPage ? sessionPage : "sessionViewer");
  }
  render() {
    return <div id="sessionMain">{this.state.displayComp}</div>;
  }
}
SessionsComp.propTypes = {
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
export default SessionsComp;
