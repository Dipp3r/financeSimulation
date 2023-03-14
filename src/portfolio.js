import React from "react";
import './styles/portfolio.css';

class PortfolioComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="portfolio">
                <div id="topBar">
                    <img src={require("./images/Arrow_left.svg")} alt="back_arrow" />
                    <p>Portfolio</p>
                    <div id="timer">
                        <img src={require("./images/Alarmclock.svg")} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
            </div> 
        )
    }
}
export default PortfolioComp;