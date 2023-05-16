import React , {Fragment} from "react";
import './styles/login.css';
import coin from "./images/coin.svg"
import FormLogin from "./components/loginForm";
class LoginComp extends React.Component{
    constructor(props){
        super(props)
        // this.login = this.login.bind(this);
    }

    // login(){
    //     let obj = {}
    //     for (let input of document.querySelectorAll(".formInput")){
    //         obj[input.getAttribute("name")] = input.value
    //     }
    //     // obj.link = ""
    //     fetch("http://localhost:3003/login", {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(obj)
    //       })
    //         .then(response => {
    //             if(response.status == 200 || response.status == 201) {
    //                 // this.props.toggleMainDisplay("dashboard")
    //             }
    //             return response.json()
    //         })   
    //         .then(data => {
    //           // Handle the response data
    //           console.log(data);
    //         })
    //         .catch(error => {
    //           // Handle any errors
    //           console.error('Error:', error);
    //         });
    //         this.props.toggleMainDisplay("dashboard")
    // }
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