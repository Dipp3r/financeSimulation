import React , {Fragment} from "react";
import './styles/login.css';
import coin from "./images/coin.svg"
import FormLogin from "./components/loginForm";
class LoginComp extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
      if(localStorage.getItem("userid")) this.props.toggleMainDisplay("dashboard")

      let groupid = window.location.href.split('/').pop()
      localStorage.setItem("groupid",groupid)
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
                <FormLogin toggleMainDisplay={this.props.toggleMainDisplay}></FormLogin>
            </div>
        )
    }
}
export default LoginComp;