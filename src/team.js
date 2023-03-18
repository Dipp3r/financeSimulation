import React from "react";
import './styles/team.css';

class TeamComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="team">
                <div id="topBar">
                    <img src={require("./images/Arrow_left.svg")} alt="back_arrow" />
                    <p>Team</p>
                    <div id="timer">
                        <img src={require("./images/Alarmclock.svg")} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                    <button id="fixed">
                        <img src={require("./images/QR.svg")} alt="qr"/>
                        <p>Invite team</p>
                    </button>

                    <div class="row">
                        <div id="portion1">
                            <img src={require("./images/User_circle.svg")} alt="profile"/>
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
                            <img src={require("./images/User_circle_light.svg")} alt="profile"/>
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
                            <img src={require("./images/User_circle_light.svg")} alt="profile"/>
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
                            <img src={require("./images/User_circle_light.svg")} alt="profile"/>
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
                            <img src={require("./images/User_circle_light.svg")} alt="profile"/>
                            <div id="info">
                                <p>Ben</p>
                                <p class="num">9446210451</p>
                            </div>
                        </div>
                        <p id="portion2">
                            
                        </p>
                    </div>

                    <div class="row">
                        <div id="portion1">
                            <img src={require("./images/User_circle_light.svg")} alt="profile"/>
                            <div id="info">
                                <p>Arya</p>
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