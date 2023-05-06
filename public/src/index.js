import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'
import { BrowserRouter, Routes, Route ,useNavigate} from "react-router-dom";
import SellComp from './buySell';
import Dashboard from './dashboard';
import LoginComp from './loginComp';
import NewsComp from './news';
import NotifComp from './notification';
import PortfolioComp from './portfolio';
import ProfileComp from './profile'; 
import StocksComp from './stocks';
import TeamComp from './team';


class IndexComp extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mainDisplay:<LoginComp toggleMainDisplay={this.toggleMainDisplay}/>
    }
  }
  toggleMainDisplay = (e)=>{
    let value = (typeof e === 'string')?e:e.currentTarget.getAttribute("value");
    console.log(value)
    let displayComp
    switch(value){
      case "dashboard":
      default:
        displayComp = <Dashboard toggleMainDisplay={this.toggleMainDisplay}/>
        break;
      case "portfolio":
        displayComp = <PortfolioComp toggleMainDisplay={this.toggleMainDisplay} />
        break;  
      case "team":
        displayComp = <TeamComp toggleMainDisplay={this.toggleMainDisplay}/>
        break;
    }
    console.log(displayComp)
    this.setState({"mainDisplay":displayComp})
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
    
    // {/*  */}
    // {/*  */}
    // {/*  */}
    // {/* <SellComp/> */}
    // {/* <NewsComp/> */}
    // {/* <NotifComp/> */}
    // {/*  */}