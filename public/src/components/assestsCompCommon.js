import React from "react";
import loss from "../images/loss.svg"
import Gain from "../images/gain.svg"
export default class AssetsCompCommon extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:this.props.name,
            totalPrice:this.props.totalPrice,
            position:this.props.position,
            singlePrice:this.props.singlePrice,
            singlePercent:this.props.singlePercent
        }
    }
    render(){
        return(
            <div className={"row "+this.state.position}>
                <p id="name">{this.state.name}</p>
                <div>
                    <p>₹{this.state.singlePrice}</p>
                    <div>
                        <img src={Gain} alt="gain"/>
                        <p class="gain">{this.state.singlePercent}%</p>
                    </div>
                </div>
                <p id="amount">₹{this.state.totalPrice}</p>
            </div>
        )
    }
}