import React from "react";
import './styles/news.css';

class NewsComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id="sell">
                <div id="topBar">
                    <div>
                        <img src={require("./images/Arrow_left.svg")} alt="back_arrow" />
                        <p>Super breaking news</p>
                    </div>
                    <div id="timer">
                        <img src={require("./images/Alarmclock.svg")} alt="timer"/>
                        <p>05:00</p>
                    </div>
                </div>
                <div id="main">
                    <div id="fixed">
                       <div></div>
                       <div></div>
                       <div></div>
                       <div></div>
                       <div></div>
                    </div>
                </div>
            </div>

        )
    }
}
export default NewsComp;