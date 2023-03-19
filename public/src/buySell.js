import React from "react";
import './styles/buySell.css';

class SellComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="sell">
                <div id="success">
                    <div id="circle">
                        <img src={require("./images/tick.svg")} alt="tick"/>
                    </div>
                    <p>SUCCESSFUL</p>
                    <p class="small">Check your portfolio</p>
                </div>
                <div id="topBar">
                    <div>
                        <img src={require("./images/Arrow_left.svg")} alt="back_arrow" />
                        <img class="coin" src={require("./images/coin.svg")} alt="coin"/>
                        <p>₹30,000</p>
                    </div>
                    <div id="timer">
                        <img src={require("./images/Alarmclock.svg")} alt="timer"/>
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