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
                <div id="main">
                    <img src={require("./images/PieChart.svg")} alt="piechart"/>
                    <div class="row">
                        <div class="column">
                            <div class="content">
                                <img src={require("./images/dot1.svg")} alt="stocks"/>
                                <p>
                                    Stocks
                                </p>
                            </div>
                            <div class="content">
                                <img src={require("./images/dot3.svg")} alt="Commodities"/>
                                <p>
                                    Commodities
                                </p>
                            </div>
                        </div>
                        
                        <div class="column">
                            <div class="content">
                                <img src={require("./images/dot2.svg")} alt="Mutual funds"/>
                                <p>
                                    Mutual funds
                                </p>
                            </div>
                            <div class="content">
                                <img src={require("./images/dot4.svg")} alt="Cash"/>
                                <p>
                                    Cash
                                </p>
                            </div>
                        </div>
                    </div>
                    <p id="title">NET WORTH</p>
                    <p id="amount">₹ 10,00,00,000</p>
                    <div id="row1">
                        <p> This year's Gain/Loss</p>
                        <p> Overall Gain/Loss</p>
                    </div>
                    <div id="row2">
                        <div class="rowContent">
                            <img src={require("./images/loss.svg")} alt="loss"/>
                            <p>20,000</p>
                            <p id="percentage">5%</p>
                        </div>
                        <hr/>
                        <div class="rowContent">
                            <img src={require("./images/gain.svg")} alt="gain"/>
                            <p>10,000</p>
                            <p id="percentage">2.5%</p>
                        </div>
                    </div>

                    <div class="card">
                        <div id="left">
                            <p>Cash</p>
                            <img src={require("./images/coin.svg")} alt="coin"/>
                        </div>

                        <div id="middle" class="mr-2">
                            <p>₹30,000</p>
                        </div>
             
                    </div>

                    <div class="card">
                        <div id="left">
                            <p>Stocks</p>
                        </div>

                        <div id="middle">
                            <p>₹1,00,000</p>
                        </div>

                        <div id="last">
                            <div id="amount">
                                <img src={require("./images/loss.svg")} alt="loss"/>
                                <p class="loss">12,000</p>
                                <button>
                                    <img src={require("./images/upArrow.svg")} alt="upArrow"/>
                                </button>
                            </div>
                        </div>          
                    </div>

                    <div class="card">
                        <div id="left">
                            <p>Mutual Funds</p>
                        </div>

                        <div id="middle">
                            <p>₹20,000</p>
                        </div>

                        <div id="last">
                            <div id="amount">
                                <img src={require("./images/gain.svg")} alt="gain"/>
                                <p class="gain">1000</p>
                                <button>
                                    <img src={require("./images/downArrow.svg")} alt="downArrow"/>
                                </button>
                            </div>
                        </div>          
                    </div>

                    <div class="card">
                        <div id="left">
                            <p>Commodities</p>
                        </div>

                        <div id="middle">
                            <p>₹3,000</p>
                        </div>

                        <div id="last">
                            <div id="amount">
                                <img src={require("./images/loss.svg")} alt="loss"/>
                                <p class="loss">5,000</p>
                                <button>
                                    <img src={require("./images/downArrow.svg")} alt="downArrow"/>
                                </button>
                            </div>
                        </div>          
                    </div>
                </div>
            </div> 
        )
    }
}
export default PortfolioComp;