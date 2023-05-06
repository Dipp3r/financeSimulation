import React from "react";

import User_circle from "./images/User.svg"
import User_fill from "./images/User_fill.svg"
import Chart_alt from "./images/Chart_alt.svg"
import Chart_alt_fill from "./images/Chart_alt_fill.svg"
import Message from "./images/Message.svg"
import Message_alt_fill from "./images/Message_alt_fill.svg"
import ProfileComp from "./profile";
import NotifComp from "./notification";
import StocksComp from './stocks';
import "./styles/dashboard.css"
class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            display:<ProfileComp/>
        }
        this.changeDisplay = this.changeDisplay.bind(this)
    }
    changeDisplay(e){
        let display;
        console.log(this.state)
        let navImg = document.querySelectorAll(".navImg")
        navImg[0].src = User_circle
        navImg[1].src = Chart_alt
        navImg[2].src = Message

        switch( e.currentTarget.value){
            case "ProfileComp":
            default:
                display = <ProfileComp />
                navImg[0].src = User_fill
                break;
            case "StocksComp":
                display =   <StocksComp/>
                navImg[1].src = Chart_alt_fill
                break;
            case "NotifComp":
                display = <NotifComp/>
                navImg[2].src = Message_alt_fill
                break;
        }
        this.setState({display:display},()=>{
            console.log(this.state.display)
        })
    }
    render(){
        return(
    <div id="dashboard">
        <div id="main">
            {this.state.display}
        </div>
        <div id="fixedNav">
            <button value="ProfileComp" onClick={this.changeDisplay}>
                <img id="userImg" class="navImg" src={User_fill} alt="User" />
            </button>
            <button value="StocksComp" onClick={this.changeDisplay}>
                <img id="chartImg" class="navImg" src={Chart_alt} alt="chart" />
            </button>
            <button value="NotifComp" onClick={this.changeDisplay}>
                <img id="messageImg" class="navImg" src={Message} alt="message" />
            </button>
        </div>
    </div>
    )
    }
}

export default Dashboard