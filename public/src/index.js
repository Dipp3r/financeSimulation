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
    this.state = {
      loginComp:true,
      profileComp:true,
      portfolioComp:false,
      teamComp:false
    }
    this.toggleLoginComp = this.toggleLoginComp.bind(this)
    this.toggleProfileComp = this.toggleProfileComp.bind(this)
    this.togglePortfolioComp = this.togglePortfolioComp.bind(this)
    this.toggleTeamComp = this.toggleTeamComp.bind(this)

  }
  toggleLoginComp(){
    let display = this.state.loginComp
    this.setState({loginComp:!display})
  }
  toggleProfileComp(){
    let display = this.state.profileComp 
    this.setState({profileComp :!display})
  }
  toggleTeamComp(){
    let display = this.state.teamComp 
    this.toggleProfileComp()
    this.setState({teamComp :!display})
  }
  togglePortfolioComp(){
    let display = this.state.portfolioComp
    this.setState({portfolioComp :!display,profileComp :display})
  }
  render(){
    console.log(this.state);
  return(
    <section id='main'>
      {this.state.loginComp && <LoginComp toggleLoginComp={this.toggleLoginComp}/>}
      {!this.state.loginComp && this.state.profileComp && <ProfileComp togglePortfolioComp={this.togglePortfolioComp} toggleTeamComp={this.toggleTeamComp}/>}
      {this.state.portfolioComp && <PortfolioComp togglePortfolioComp={this.togglePortfolioComp} />}
      {this.state.teamComp && <TeamComp toggleTeamComp={this.toggleTeamComp} /> }
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
    // {/* <StocksComp/> */}