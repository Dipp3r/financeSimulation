import React from "react";
import grad_checkbox from "../images/grad_checkbox.svg"
export default class PlayerComp extends React.Component {
  constructor(props){
    super(props)
    this.state = {...this.props.playerObj}
  }
  render(){
     return(
      <div class="row">
          <button>
            <img src={grad_checkbox} alt="checkbox"/>
            <input type="checkbox" class="checkbox-round" />
          </button>
          <p>{this.state.name}</p>
          <p>{this.state.phone}</p>
          <select name="role" placeholder="Select" id="role" defaultValue={this.state.role}>
            <option id="select" value="-1" disabled selected>Select</option>
            <option value="0">Executive</option>
            <option value="1">Accountant</option>
            <option value="2">Analyst</option>
          </select>
          <button id="remove">remove</button>
        </div>
    )
  }
}