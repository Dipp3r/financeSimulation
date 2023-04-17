import React from "react";
import './styles/login.css';
import coin from "./images/coin.svg"
class LoginComp extends React.Component{
    constructor(props){
        super(props)
        this.login = this.login.bind(this)
    }
    login(){
        this.props.toggleLoginComp()
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
                    <img src={coin} alt="coin"/>
                </div>
                <input id="name" type="text" placeholder="Name"/>
                <input id="mobile" type="number" placeholder="1234567890"/>
                <input id="password" type="password" placeholder="password"/>
                <button id="loginButton" onClick={this.login}>
                    Login
                </button>
            </div>
        )
    }
}
export default LoginComp;