 import React from "react";
import NewsComp from "./components/newsComp";
import Alarmclock from  "./images/Alarmclock.svg"
import Export from "./images/Export.svg"
class EditComp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            StockList:['Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar'],
            MutualFundList:['RIP','Ram ','Dom'],
            CommoditiesList:['B.O.Thai','home home','Tar Tar'],
            currentActiveAssetButton:"0",
            currentActiveSection:'0',
            newsList:[{year:2000},{year:2001},{year:2002}]
        }
        this.toggleAssetSection = this.toggleAssetSection.bind(this)
        this.toggleMainSection = this.toggleMainSection.bind(this)
        
        this.displayList = this.displayList.bind(this)
    }
    toggleAssetSection(e){
        let assetButtons = document.querySelector("#top").children
        let currentActiveAssetButton = "0"
        if(e != undefined){
            currentActiveAssetButton = e.currentTarget.getAttribute('value')
        }
        assetButtons[this.state.currentActiveAssetButton].style.borderBottomColor = "#8492B3"
        assetButtons[currentActiveAssetButton].style.borderBottomColor = "#223F80"
        
        this.setState({currentActiveAssetButton:currentActiveAssetButton})
        switch(currentActiveAssetButton){
            case '1':
               this.displayList(this.state.MutualFundList)
               break;
            case '2':
                this.displayList(this.state.CommoditiesList)
                break;
            case '0':
            default:
                this.displayList(this.state.StockList)
        }
    }
    toggleMainSection(e){
        let value = "0"
        if(e != undefined){
            value = e.currentTarget.getAttribute('value')
        }
        let sectionButtons = document.querySelector("#editMain").querySelector("#topNav").children
        
        sectionButtons[this.state.currentActiveSection].style.background = "transparent"
        sectionButtons[this.state.currentActiveSection].style.color = "#223F80"
        sectionButtons[value].style.backgroundColor = "#223f80bf"
        sectionButtons[value].style.color = "#FFF"
        
        let sections = document.querySelector("#editMain").querySelectorAll(".section")
        sections.forEach((section)=>{
            section.style.display = "none"
        })
        sections[value].style.display = "unset"
        this.setState({currentActiveSection:value})
    }
    displayList(list){
        if(list.length  <= 0) return
        let container = document.querySelector('#editMainSection')
        let card,p1,p2,num = 1
        container.innerHTML = ''
        for(let item of list){
            card = document.createElement('div')
            p1 = document.createElement('p')
            p1.innerText = num < 10?`0${num}`:num;
            p2 = document.createElement('p')
            p2.style.color="#223F80";
            p2.innerText = item
            card.appendChild(p1)
            card.appendChild(p2)
            container.appendChild(card)
            num+=1
        }
    }
    componentDidMount(){
        this.toggleMainSection()
        this.toggleAssetSection()
        this.displayList(this.state.StockList)
    }
    render(){
        return(
            <div id="editMain">
                <div id="topNav">
                    <button value={0} onClick={this.toggleMainSection} >Assets</button>
                    <button value={1} onClick={this.toggleMainSection} >News</button>
                </div>
                <div id='assets' className="section">
                    <div id="top">
                        <button value='0' onClick={this.toggleAssetSection}  >Stocks</button>
                        <button value='1' onClick={this.toggleAssetSection}  >Mutual funds</button>
                        <button value='2' onClick={this.toggleAssetSection}  >Commodities</button>
                    </div>
                    <div id='editMainSection'>
                        {/* assets list here */}
                    </div>
                </div>
                <div id="news" class="section row-1">
                    {this.state.newsList.map((news,index)=>{
                        return <NewsComp data={news} key={index}/>
                    })}
                </div>
            </div>
        )
    }
}
export default EditComp