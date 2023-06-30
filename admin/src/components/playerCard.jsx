import React from "react";
import PropTypes from "prop-types";
// import grad_checkbox from "@assets/images/grad_checkbox.svg";

export default class PlayerComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.playerObj };
  }
  changeRole = (event) => {
    let obj = {};
    obj.userid = this.state.userid;
    obj.role = event.currentTarget.value;
    fetch(import.meta.env.VITE_API_SERVER_URL + `assignrole`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(obj),
    });
    this.setState({ role: obj.role });
    // const checkbox = document.querySelector("#checkbox-round");
    // checkbox.checked = obj.role === "0" ? true : false;
  };
  removePlayer = () => {};
  // componentDidMount() {
  //   const checkbox = document.querySelector("#checkbox-round");
  //   checkbox.checked = this.state.role === "0" ? true : false;
  // }
  render() {
    console.log(this.props.playerObj);
    return (
      <div className="row">
        {/* <button>
          <img src={grad_checkbox} alt="checkbox" />
          <input
            type="checkbox"
            id="checkbox-round"
            className="checkbox-round"
            disabled
          />
        </button> */}
        <p>{this.state.name}</p>
        <p>{this.state.mobile}</p>
        <select
          name="role"
          placeholder="Select"
          id="role"
          defaultValue={this.state.role !== "" ? this.state.role : "-1"}
          onChange={this.changeRole}
        >
          <option id="select" value="-1">
            Select
          </option>
          <option value="0">Executive</option>
          <option value="1">Accountant</option>
          <option value="2">Analyst</option>
        </select>
        <button id="remove" onClick={this.removePlayer}>
          remove
        </button>
      </div>
    );
  }
}
PlayerComp.propTypes = {
  playerObj: PropTypes.object.isRequired,
};
