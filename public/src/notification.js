import React from "react";
import './styles/notif.css';

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
                        <img src={require("./images/Alarmclock.svg")} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                    <div class="notif">
                        <img src={require("./images/Paper.svg")} alt="paper"/>
                        <p>
                            Super breaking news | 2100
                        </p>
                    </div>
                    <div class="notif">
                        <img class="coin" src={require("./images/coin.svg")} alt="coin"/>
                        <p class="text-thin">
                            ₹1,00,000 of vittae coins has
                            <br/> been credited
                        </p>
                    </div>
                    <div class="notif notif-extend">
                        <img class="coin" src={require("./images/Group_fill.svg")} alt="group"/>
                        <p class="text-thin">
                            Arya joined your team
                        </p>
                    </div>
                    <div class="notif notif-extend">
                        <img class="coin" src={require("./images/Star.svg")} alt="star"/>
                        <p class="text-thin">
                            You’ve been assigned as an Analyst
                        </p>
                    </div>
                    <div id="fixedNav">
                        <button>
                            <img src={require("./images/User.svg")} alt="User" />
                        </button>
                        <button>
                            <img src={require("./images/Chart_alt.svg")} alt="chart" />
                        </button>
                        <button>
                            <img src={require("./images/Message_alt_fill.svg")} alt="message" />
                        </button>
                    </div>
                
                </div>
            </div> 
        )
    }
}
export default NotifComp;