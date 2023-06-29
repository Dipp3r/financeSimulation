import React from 'react';
import ReactDOM from 'react-dom/client';
import SellComp from '@pages/buySell';
import Dashboard from '@pages/dashboard/dashboard';
import LoginComp from '@pages/loginComp';
import PortfolioComp from '@pages/portfolio';
import TeamComp from '@pages/team';
import * as serviceWorkerRegistration from "@utils/serviceWorkerRegistration";
const socket = new WebSocket('ws://localhost:3003');

class IndexComp extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mainDisplay:<LoginComp toggleMainDisplay={this.toggleMainDisplay}/>
    }
  }
  setItem = (name,value)=>{
    this.setState({[name]:value},()=>{
      console.log(this.state)
    })
  }
  getItem=(name)=>{
    return this.state[name]
  }
  toggleMainDisplay = (e,res)=>{
    let value = (typeof e === 'string')?e:e.currentTarget.getAttribute("value");
    console.log(value)
    let displayComp
    switch(value){
      case "dashboard":
      default:
        displayComp = <Dashboard toggleMainDisplay={this.toggleMainDisplay} value={res} setItem={this.setItem} getItem={this.getItem}/>
        break;
      case "portfolio":
        displayComp = <PortfolioComp toggleMainDisplay={this.toggleMainDisplay} setItem={this.setItem} getItem={this.getItem}/>
        break;  
      case "team":
        displayComp = <TeamComp toggleMainDisplay={this.toggleMainDisplay} setItem={this.setItem} getItem={this.getItem}/>
        break;
      case "purchase":
        displayComp = <SellComp toggleMainDisplay={this.toggleMainDisplay} setItem={this.setItem} getItem={this.getItem}/>
        break;
      case "login":
        displayComp = <LoginComp toggleMainDisplay={this.toggleMainDisplay}/>
        break;
    }
    console.log(displayComp)
    this.setState({"mainDisplay":displayComp})
  }
  componentDidMount(){
    // When the WebSocket connection is opened
    socket.addEventListener('open', function (event) {
      console.log('WebSocket connection opened');
    });

    // When a message is received from the WebSocket server
    socket.addEventListener('message', function (event) {
      console.log('Received message from server:', JSON.parse(event.data));
    });
  }
  render(){
    console.log(this.state);
  return(
    <section>
      {this.state.mainDisplay}
    </section>
  )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IndexComp/>
);
serviceWorkerRegistration.register();