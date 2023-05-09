import React from 'react';
import ReactDOM from 'react-dom/client';
import EditComp from './edit';
// import { HashRouter } from 'react-router-dom'
// import { BrowserRouter, Routes, Route ,useNavigate} from "react-router-dom";
import SessionsComp from './sessions';
import "./styles/home.css";
import Group from './images/Group.svg';
import Edit from './images/Edit.svg';
import Edit_white from './images/Edit_white.svg';
import Group_white from './images/Group_white.svg';
import vittae_logo_color from "./images/vittae_logo_color.svg"
import illustration from "./images/illustration.svg"
class IndexComp extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mainPage:0
    }
    this.getItem = this.getItem.bind(this)
    this.setItem = this.setItem.bind(this)
    this.toggleMainPage = this.toggleMainPage.bind(this)
  }
  getItem(key){
    console.log(this.state[key])
    return  this.state[key]
  }
  setItem(obj){
    console.log(obj)
    this.setState(obj)
  }
  toggleMainPage(e){
    
    let value = "0" 
    if(e != undefined) value = e.currentTarget.getAttribute("value")
    
    this.setState({mainPage:value})
    let options = document.querySelector("#options").childNodes
    console.log(options)
    
    options.forEach(element => {
      element.style.background = "transparent"
      element.style.color = "#223F80"
    });
    switch(value){
      case "0":
      default:
        document.querySelector("#imgGroup").src = Group_white

        document.querySelector("#imgEdit").src = Edit
        break;
      case "1":
        document.querySelector("#imgEdit").src = Edit_white
        document.querySelector("#imgGroup").src = Group
        break;
    }
    options[value].style.backgroundColor = "#223f80"
    options[value].style.color = "#FFF"
  }
  componentDidMount(){
    this.toggleMainPage()
  }
  render(){
    console.log(this.state);
    let mainPage
    switch(this.state.mainPage){
      case '1':
        mainPage = <EditComp/>
        break;
      case '0':
      default:
        mainPage = <SessionsComp/>
        break;
    }

  return(
    <section id="home">
      <nav id="sideBar">
        <img src={vittae_logo_color} alt="vittae logo" />
        <div id="options">
          <div class="button" value='0'onClick={this.toggleMainPage}>
            <img id="imgGroup" src={Group} alt="groupIcon"/>
            Sessions
          </div>
          <div class="button" value='1' onClick={this.toggleMainPage}>
            <img id="imgEdit" src={Edit} alt="editIcon"/>  
            Edit
          </div>
        </div>
        <img id="tree" src={illustration} alt="tree illustration" />
      </nav>
      <div id='main'>
        {mainPage}
        {/* <SessionsComp /> */}
      </div>
    </section>
  )
  }
}




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<IndexComp/>);
