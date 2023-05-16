import React from "react";
import './styles/stocks.css';
import Alarmclock from "./images/Alarmclock.svg"
import Coin from "./images/coin.svg"
import Gain from "./images/gain.svg"
import AssetsCompCommon from "./components/assestsCompCommon";
class StocksComp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            stocks:[
                {
                    id:0,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:1,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:2,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:3,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:4,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:5,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:6,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:7,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:8,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:9,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:10,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:11,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:5
                }
            ],
            mutualFund:[
                {
                    id:0,
                    name:"Tar Tar",
                    totalPrice:800,
                    changedTotalPrice:10,
                    singlePrice:900,
                    singlePercent:10
                },
                {
                    id:1,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:2
                },
                {
                    id:2,
                    name:"Ram dom",
                    totalPrice:5000,
                    changedTotalPrice:200,
                    singlePrice:100,
                    singlePercent:5
                }
            ],
            commodities: [],
            content:[]
        }
    }
    toggleStatusButton = (e)=>{
        let target = e?e.currentTarget:document.querySelector("#statusButton").children[0]
        let buttons = document.querySelector("#statusButton").children
        Array.from(buttons).forEach((button)=>{
            button.style.color="rgba(34, 63, 128, 0.5)"
            button.style.borderBottomColor="rgba(34, 63, 128, 0.4)"
        })
        target.style.color="#223F80"
        target.style.borderBottomColor="#223F80"
        let content;
        switch(target.getAttribute("value")){
            case "stock":
            default:
                content = this.state.stocks
                break;
            case "mutualFund":
                content = this.state.mutualFund
                break;
            case "commodities":
                content = this.state.commodities
                break;
        }
        this.setState({content:content})
    }
    componentDidMount(){
        this.toggleStatusButton()
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
                        <div id="marquee">
                            {this.state.content.map((element,index)=>{
                                // console.log(element,index)
                                return <div>
                                        <p>{element.name} | {element.singlePrice} |</p><a class="gain">{element.singlePercent}%</a>
                                    </div>
                            })}
                        </div>       
                    </div>
                    <div id="about">
                        <div id="statusButton">
                            <button onClick={this.toggleStatusButton} value="stock">Stocks</button>
                            <button onClick={this.toggleStatusButton} value="mutualFund">Mutual fund</button>
                            <button onClick={this.toggleStatusButton} value="commodities">Commodities</button>
                        </div>
                    </div>
                    <div id="content">
                        {this.state.content.map((element,index)=>{
                            // console.log(element,index)
                            return <AssetsCompCommon key={index}
                            name={element.name} 
                            totalPrice={element.totalPrice}
                            singlePrice={element.singlePrice}
                            singlePercent={element.singlePercent}
                            position={index%2===0?"top":"bottom"}
                            toggleMainDisplay={this.props.toggleMainDisplay}
                            />

                        })}

                        {/* <div class="row top">
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
                        </div> */}
                        
                    </div>
                </div>
            </div>

        )
    }
}
export default StocksComp;