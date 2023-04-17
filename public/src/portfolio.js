import React from "react";
import './styles/portfolio.css';
import Arrow_left from "./images/Arrow_left.svg"
import Alarmclock from "./images/Alarmclock.svg"
import PieChart from "./images/PieChart.svg"
import dot1 from "./images/dot1.svg"
import dot3 from "./images/dot3.svg"
import dot2 from "./images/dot2.svg"
import dot4 from "./images/dot4.svg"
import loss from "./images/loss.svg"
import gain from "./images/gain.svg"
import coin from "./images/coin.svg"
import upArrow from "./images/upArrow.svg"
import downArrow from "./images/downArrow.svg"

class PortfolioComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="portfolio">
                <div id="topBar">
                    <img src={Arrow_left} onClick={this.props.togglePortfolioComp} alt="back_arrow" />
                    <p>Portfolio</p>
                    <div id="timer">
                        <img src={Alarmclock} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                    <img src={PieChart} alt="piechart"/>
                    <div class="row">
                        <div class="column">
                            <div class="content">
                                <img src={dot1} alt="stocks"/>
                                <p>
                                    Stocks
                                </p>
                            </div>
                            <div class="content">
                                <img src={dot3} alt="Commodities"/>
                                <p>
                                    Commodities
                                </p>
                            </div>
                        </div>
                        
                        <div class="column">
                            <div class="content">
                                <img src={dot2} alt="Mutual funds"/>
                                <p>
                                    Mutual funds
                                </p>
                            </div>
                            <div class="content">
                                <img src={dot4} alt="Cash"/>
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
                            <img src={loss} alt="loss"/>
                            <p>20,000</p>
                            <p id="percentage">5%</p>
                        </div>
                        <hr/>
                        <div class="rowContent">
                            <img src={gain} alt="gain"/>
                            <p>10,000</p>
                            <p id="percentage">2.5%</p>
                        </div>
                    </div>

                    <div class="card">
                        <div id="left">
                            <p>Cash</p>
                            <img src={coin} alt="coin"/>
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
                                <img src={loss} alt="loss"/>
                                <p class="loss">12,000</p>
                                <button>
                                    <img src={upArrow} alt="upArrow"/>
                                </button>
                            </div>
                        </div>          
                    </div>

                    <div id="expand">
                        <div class="row">
                            <p id="name">Ram dom</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <div>
                                <p>₹49,800</p>
                                <div>
                                    <img src={loss} alt="loss"/>
                                    <p class="loss">₹200</p>
                                </div>
                            </div>
                        </div>
                        <hr/>

                        <div class="row">
                            <p id="name">Ram dom</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <div>
                                <p>₹49,800</p>
                                <div>
                                    <img src={loss} alt="loss"/>
                                    <p class="loss">₹200</p>
                                </div>
                            </div>
                        </div>
                        <hr/>

                        <div class="row">
                            <p id="name">Ram dom</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <div>
                                <p>₹49,800</p>
                                <div>
                                    <img src={loss} alt="loss"/>
                                    <p class="loss">₹200</p>
                                </div>
                            </div>
                        </div>
                        <hr/>

                        <div class="row">
                            <p id="name">Ram dom</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <div>
                                <p>₹49,800</p>
                                <div>
                                    <img src={loss} alt="loss"/>
                                    <p class="loss">₹200</p>
                                </div>
                            </div>
                        </div>
                        <hr/>

                        <div class="row">
                            <p id="name">Ram dom</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <div>
                                <p>₹49,800</p>
                                <div>
                                    <img src={loss} alt="loss"/>
                                    <p class="loss">₹200</p>
                                </div>
                            </div>
                        </div>
                        <hr/>

                        <div class="row">
                            <p id="name">Ram dom</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <div>
                                <p>₹49,800</p>
                                <div>
                                    <img src={loss} alt="loss"/>
                                    <p class="loss">₹200</p>
                                </div>
                            </div>
                        </div>
                        <hr/>

                        <div class="row">
                            <p id="name">Ram dom</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <div>
                                <p>₹49,800</p>
                                <div>
                                    <img src={loss} alt="loss"/>
                                    <p class="loss">₹200</p>
                                </div>
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
                                <img src={gain} alt="gain"/>
                                <p class="gain">1000</p>
                                <button>
                                    <img src={downArrow} alt="downArrow"/>
                                </button>
                            </div>
                        </div>          
                    </div>

                    <div class="card final">
                        <div id="left">
                            <p>Commodities</p>
                        </div>

                        <div id="middle">
                            <p>₹3,000</p>
                        </div>

                        <div id="last">
                            <div id="amount">
                                <img src={loss} alt="loss"/>
                                <p class="loss">5,000</p>
                                <button>
                                    <img src={downArrow} alt="downArrow"/>
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