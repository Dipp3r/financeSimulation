import React from "react";
import './styles/stocks.css';
import Alarmclock from "./images/Alarmclock.svg"
import Coin from "./images/coin.svg"
import Gain from "./images/gain.svg"
class StocksComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="stocks">
                
                <div id="topBar">
                    <div>
                        <img class="coin" src={Coin} alt="coin"/>
                        <p>₹30,000</p>
                    </div>
                    <p>Buy/Sell</p>
                    <div id="timer">
                        <img src={Alarmclock} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                    <div id="stockInfo">
                        <div>
                            <p>Ram | ₹100 |</p><a class="gain">2%</a>
                        </div>
                       <div>
                            <p>tar tar | ₹50 |</p> <a class="loss">2%</a>
                       </div>
                        <div>
                            <p>Rip | ₹150 |</p> <a class="loss">2%</a>
                        </div>
                        <div>
                            <p>tar tar | ₹50 |</p> <a class="loss">2%</a>
                        </div>                        
                    </div>
                    <div id="about">
                        <div id="statusButton">
                            <button>Stocks</button>
                            <button>Mutual fund</button>
                            <button>Commodities</button>
                        </div>
                    </div>
                    <div id="content">

                        <div class="row top">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>
                        <div class="row bottom">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="loss">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>

                        <div class="row top">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="loss">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>
                        <div class="row bottom">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>

                        <div class="row top">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="loss">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>
                        <div class="row bottom">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>

                        <div class="row top">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="loss">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>
                        <div class="row bottom">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>

                        <div class="row top">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="loss">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>
                        <div class="row bottom">
                            <p id="name">Ram Dam</p>
                            <div>
                                <p>₹100</p>
                                <div>
                                    <img src={Gain} alt="gain"/>
                                    <p class="gain">2%</p>
                                </div>
                            </div>
                            <p id="amount">₹20,000</p>
                        </div>
                        
                    </div>
                </div>
            </div>

        )
    }
}
export default StocksComp;