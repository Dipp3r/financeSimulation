import React from "react";
import './styles/team.css';

import Arrow_left from "./images/Arrow_left.svg"
import Alarmclock from "./images/Alarmclock.svg"
import QR from "./images/QR.svg"
import User_circle from "./images/User_circle.svg"
import User_circle_light from "./images/User_circle_light.svg"

class TeamComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="team">
                <div id="topBar">
                    <img src={Arrow_left} alt="back_arrow" onClick={this.props.toggleMainDisplay} value="dashboard"/>
                    <p>Team</p>
                    <div id="timer">
                        <img src={Alarmclock} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                    <button id="fixed">
                        <img src={QR} alt="qr"/>
                        <p>Invite team</p>
                    </button>

                    <div class="row">
                        <div id="portion1">
                            <img src={User_circle} alt="profile"/>
                            <div id="info">
                                <p>Allwyn</p>
                                <p class="num">9446210451</p>
                            </div>
                        </div>
                        <p id="portion2">
                            Executive
                        </p>
                    </div>

                    <div class="row">
                        <div id="portion1">
                            <img src={User_circle_light} alt="profile"/>
                            <div id="info">
                                <p>Ding</p>
                                <p class="num">9446210451</p>
                            </div>
                        </div>
                        <p id="portion2">
                            Accountant
                        </p>
                    </div>

                    <div class="row">
                        <div id="portion1">
                            <img src={User_circle_light} alt="profile"/>
                            <div id="info">
                                <p>Dong</p>
                                <p class="num">9446210451</p>
                            </div>
                        </div>
                        <p id="portion2">
                            Analyst
                        </p>
                    </div>

                    <div class="row">
                        <div id="portion1">
                            <img src={User_circle_light} alt="profile"/>
                            <div id="info">
                                <p>Oggy</p>
                                <p class="num">9446210451</p>
                            </div>
                        </div>
                        <p id="portion2">

                        </p>
                    </div>

                    <div class="row">
                        <div id="portion1">
                            <img src={User_circle_light} alt="profile"/>
                            <div id="info">
                                <p>Ben</p>
                                <p class="num">9446210451</p>
                            </div>
                        </div>
                        <p id="portion2">
                            
                        </p>
                    </div>
                </div>
            </div> 
        )
    }
}
export default TeamComp;