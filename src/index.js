import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'
import { BrowserRouter, Routes, Route ,useNavigate} from "react-router-dom";
import LoginComp from './loginComp';
import PortfolioComp from './portfolio';
import ProfileComp from './profile'; 

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
    {/* <ProfileComp/> */}
    <PortfolioComp/>
  </div>
);
