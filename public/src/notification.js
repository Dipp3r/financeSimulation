import React from "react";
import './styles/notif.css';
import Alarmclock from "./images/Alarmclock.svg"
import Paper from "./images/Paper.svg"
import Coin from "./images/coin.svg"
import Group_fill from "./images/Group_fill.svg"
import Star from "./images/Star.svg"
class NotifComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="notification">
                <div id="topBar">
                    <div></div>
                    <p>Notification</p>
                    <div id="timer">
                        <img src={Alarmclock} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                <div class="notif">
                    <img src={Paper} alt="paper"/>
                    <p>
                        Super breaking news | 2100
                    </p>
                </div>
                <div class="notif">
                    <img class="coin" src={Coin} alt="coin"/>
                    <p class="text-thin">
                        ₹1,00,000 of vittae coins has
                        <br/> been credited
                    </p>
                </div>
                <div class="notif notif-extend">
                    <img class="coin" src={Group_fill} alt="group"/>
                    <p class="text-thin">
                        Arya joined your team
                    </p>
                </div>
                <div class="notif notif-extend">
                    <img class="coin" src={Star} alt="star"/>
                    <p class="text-thin">
                        You’ve been assigned as an Analyst
                    </p>
                </div>
                </div> 
            </div>
        )
    }
}
export default NotifComp;