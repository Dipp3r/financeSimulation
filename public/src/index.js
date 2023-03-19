import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'
import { BrowserRouter, Routes, Route ,useNavigate} from "react-router-dom";
import SellComp from './buySell';
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
    this.state = {}
  }
  render(){
    console.log(this.state);
  return(
    <section id='main'>
    </section>
  )
  }
}




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    {/* <LoginComp/> */}
    <ProfileComp/>
    {/* <PortfolioComp/> */}
    {/* <TeamComp/> */}
    {/* <SellComp/> */}
    {/* <NewsComp/> */}
    {/* <NotifComp/> */}
    {/* <StocksComp/> */}
  </div>
);
