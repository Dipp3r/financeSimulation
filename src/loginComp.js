import React from "react";
import './styles/login.css';

class LoginComp extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div id='login' >
                <div id="portion1">
                    <div id="description">
                        <p>Login</p>
                        <p>to</p>
                        <p>play</p>
                    </div>
                    <img src={require("./images/coin.svg")} alt="coin"/>
                </div>
                <input type="text" placeholder="Name"/>
                <input type="number" placeholder="1234567890"/>
                <button id="loginButton">
                    Login
                </button>
            </div>
        )
    }
}
export default LoginComp;