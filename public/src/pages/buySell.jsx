import React from "react";
import '@assets/styles/buySell.scss';

import tick from "@assets/images/tick.svg"
import Alarmclock from "@assets/images/Alarmclock.svg"
import Coin from "@assets/images/coin.svg"
import Arrow_left from "@assets/images/Arrow_left.svg"

class SellComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="sell">
                <div id="success">
                    <div id="circle">
                        <img src={tick} alt="tick"/>
                    </div>
                    <p>SUCCESSFUL</p>
                    <p class="small">Check your portfolio</p>
                </div>
                <div id="topBar">
                    <div>
                        <img src={Arrow_left} alt="back_arrow" onClick={this.props.toggleMainDisplay} value="dashboard" />
                        <img class="coin" src={Coin} alt="coin"/>
                        <p>₹30,000</p>
                    </div>
                    <div id="timer">
                        <img src={Alarmclock} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                    <div id="about">
                        <p>Ram Dam ₹0</p>
                        <div>
                            <button>BUY</button>
                            <button>SELL</button>
                        </div>
                    </div>
                    <div id="content">
                        <p>ENTER AMOUNT</p>
                        <div id="amount">
                            <p>₹</p>
                            <input type="text" placeholder="0"/>
                        </div>
                    </div>
                    <div id="fixed">
                        <button>
                            BUY
                        </button>
                    </div>
                </div>
            </div>

        )
    }
}
export default SellComp;