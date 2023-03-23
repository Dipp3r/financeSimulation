 import React from "react";

class EditComp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            StockList:['Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar','Ram dom','B.O.Thai','Tar Tar'],
            MutualFundList:['RIP','Ram ','Dom'],
            CommoditiesList:['B.O.Thai','home home','Tar Tar']
        }
        this.toggleMainSection = this.toggleMainSection.bind(this)
        this.displayList = this.displayList.bind(this)
    }
    toggleMainSection(e){
        console.log(e,e.currentTarget)
        switch(e.currentTarget.getAttribute('value')){
            case '1':
               this.displayList(this.state.MutualFundList)
               break;
            case '2':
                this.displayList(this.state.CommoditiesList)
                break;
            default:
                this.displayList(this.state.StockList)
        }
    }
    displayList(list){
        if(list.length  <= 0) return
        let container = document.querySelector('#editMainSection')
        let card,p1,p2,num = 0
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
        this.displayList(this.state.StockList)
    }
    render(){
        return(
            <div id="editMain">
                <div id="topNav">
                    <button>Assets</button>
                    <button>News</button>
                </div>
                <div id='assets'>
                    <div id="top">
                        <button value='0' onClick={this.toggleMainSection}  >Stocks</button>
                        <button value='1' onClick={this.toggleMainSection}  >Mutual funds</button>
                        <button value='2' onClick={this.toggleMainSection}  >Commodities</button>
                    </div>
                    <div id='editMainSection'></div>
                </div>
                <div id="news" class="row-1">
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="newsComp">
                        <div id="first">
                            <p id="year">2099</p>
                            <p>Open phase</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="alarmclock"/>
                                <p>05:00</p>
                            </div>
                        </div>
                        <div class="newsUpdate">
                            <p>Market update</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export" />
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                        <div class="newsUpdate">
                            <p>Super breaking news</p>
                            <div>
                                <img src={require("./images/Alarmclock.svg")} alt="" />
                                <p>05:00</p>
                            </div>
                            <button>
                                <div>
                                    <img src={require("./images/Export.svg")} alt="Export"/>
                                    <p>Upload</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default EditComp