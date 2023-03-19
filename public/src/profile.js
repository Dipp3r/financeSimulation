import React from "react";
import './styles/profile.css';

class ProfileComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="profile">
                <div id="topBar">
                    <div></div>
                    <p>Profile</p>
                    <div id="timer">
                        <img src={require("./images/Alarmclock.svg")} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                <div id="circle">
                    <div id="progress"></div>
                    <p id="title">Year</p>
                    <p id="yearNum">2100</p>
                </div>
                <div id="badgeStart" class="badgeRow">
                    <img src={require("./images/badge.svg")} alt="badge1" />
                    <img src={require("./images/emptyBadge.svg")} alt="emptyBadge" />
                    <img src={require("./images/emptyBadge.svg")} alt="emptyBadge" />
                </div>
                <div class="badgeRow">
                    <img src={require("./images/emptyBadge.svg")} alt="emptyBadge" />
                    <img src={require("./images/emptyBadge.svg")} alt="emptyBadge" />
                    <img src={require("./images/emptyBadge.svg")} alt="emptyBadge" />
                    <img src={require("./images/emptyBadge.svg")} alt="emptyBadge" />
                </div>
                <div id="card"></div>
                <p id="desc">Will unlock once all the badges have been collected</p>
                <div id="options">
                    <div class="option">
                        <img src={require("./images/pie_chart.svg")} alt="portfolio logo" />
                        <p>Portfolio</p>
                    </div>
                    <hr/>

                    <div class="option" id="team">
                        <img src={require("./images/Group.svg")} alt="team logo" />
                        <p>Team</p>
                    </div>

                    <hr/>
                    <div class="option">
                        <img src={require("./images/Vector.svg")} alt="logout logo" />
                        <p>Portfolio</p>
                    </div>
                </div>

                <div id="fixedNav">
                    <button>
                        <img src={require("./images/User_fill.svg")} alt="User" />
                    </button>
                    <button>
                        <img src={require("./images/Chart_alt.svg")} alt="chart" />
                    </button>
                    <button>
                        <img src={require("./images/Message.svg")} alt="message" />
                    </button>
                </div>
                
                </div>
            </div> 
        )
    }
}
export default ProfileComp;