import React from "react";
import './styles/profile.css';
import Alarmclock from "./images/Alarmclock.svg"
import Arrow_left from "./images/Arrow_left.svg"
import badge from "./images/badge.svg"
import emptyBadge from "./images/emptyBadge.svg"
import pie_chart from "./images/pie_chart.svg"
import Group from "./images/Group.svg"
import Vector from "./images/Vector.svg"
import User_fill from "./images/User_fill.svg"
import Chart_alt from "./images/Chart_alt.svg"
import Message from "./images/Message.svg";



class ProfileComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        {console.log()}
        return(
            <div id="profile">
                <div id="topBar">
                    {/* <img src={Arrow_left} onClick={this.props.togglePortfolioComp} alt="back_arrow" /> */}
                    <div></div>
                    <p>profile</p>
                    <div id="timer">
                        <img src={Alarmclock} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                <div id="circle">
                    <div id="progress"></div>
                    <p id="title">Year</p>
                    <p id="yearNum">2100</p>
                </div>
                <div id="badgeStart" className="badgeRow">
                    <img src={badge} alt="badge1" />
                    <img src={emptyBadge} alt="emptyBadge" />
                    <img src={emptyBadge} alt="emptyBadge" />
                </div>
                <div className="badgeRow">
                    <img src={emptyBadge} alt="emptyBadge" />
                    <img src={emptyBadge} alt="emptyBadge" />
                    <img src={emptyBadge} alt="emptyBadge" />
                    <img src={emptyBadge} alt="emptyBadge" />
                </div>
                <div id="card"></div>
                <p id="desc">Will unlock once all the badges have been collected</p>
                <div id="options">
                    <div className="option" onClick={this.props.toggleMainDisplay} value="portfolio">
                        <img src={pie_chart} alt="portfolio logo" />
                        <p>Portfolio</p>
                    </div>
                    <hr/>

                    <div className="option" id="team" onClick={this.props.toggleMainDisplay} value="team">
                        <img src={Group} alt="team logo" />
                        <p>Team</p>
                    </div>

                    <hr/>
                    <div className="option">
                        <img src={Vector} alt="logout logo" />
                        <p>Log out</p>
                    </div>
                </div>
                </div>
            </div> 
        )
    }
}
export default ProfileComp;