import React from "react";
import '@assets/styles/team.scss';

import Arrow_left from "@assets/images/Arrow_left.svg"
import Alarmclock from "@assets/images/Alarmclock.svg"
import QR from "@assets/images/QR.svg"

import TeamCardComp from "@components/teamCard";

class TeamComp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            team :[{name:"AAA",phone:"123456789",roll:"Executive",isExecutive:true},
            {name:"BBB",phone:"123456789",roll:"Accountent",isExecutive:false},
            {name:"CCC",phone:"123456789",roll:"Analysist",isExecutive:false},
            {name:"DDD",phone:"123456789",roll:"",isExecutive:false},
            {name:"EEE",phone:"123456789",roll:"",isExecutive:false}],
            teamComp:[]
        }
    }
    componentDidMount(){
        console.log("starting")
        let teamCompList = []
        {this.state.team.map((player,index)=>{
            
            teamCompList.push(<TeamCardComp key={index} player={player}/>)
        })}
        this.setState({"teamComp":teamCompList})
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
                    {this.state.teamComp.map((player)=>{
                        return player
                    })}
                </div>
            </div> 
        )
    }
}
export default TeamComp;