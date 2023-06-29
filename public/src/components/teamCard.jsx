import React from "react";
import PropTypes from "prop-types";
import User_circle from "@assets/images/User_circle.svg";
import User_circle_light from "@assets/images/User_circle_light.svg";
export default class TeamCardComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: this.props.player,
    };
  }
  roleNumToString = (role) => {
    switch (role) {
      default:
      case "":
        return "";
      case "0":
        return "Executive";
      case "1":
        return "Accountant";
      case "2":
        return "Analyst";
    }
  };
  render() {
    return (
      <div className="row">
        <div id="portion1">
          <img
            src={
              this.state.player.role == "0" ? User_circle : User_circle_light
            }
            alt="profile"
          />
          <div id="info">
            <p>{this.state.player.name}</p>
            <p className="num">{this.state.player.mobile}</p>
          </div>
        </div>
        <p id="portion2">{this.roleNumToString(this.state.player.role)}</p>
      </div>
    );
  }
}
TeamCardComp.propTypes = {
  player: PropTypes.object.isRequired,
};
