import React from "react";
import NewsComp from "@components/newsComp";
import AssetsViewer from "./assetsViewer";
// import Alarmclock from  "./images/Alarmclock.svg"
// import Export from "./images/Export.svg"
class EditComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StockList: [
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
        "Ram dom",
        "B.O.Thai",
        "Tar Tar",
      ],
      MutualFundList: ["RIP", "Ram ", "Dom"],
      CommoditiesList: ["B.O.Thai", "home home", "Tar Tar"],
      currentActiveAssetButton: "0",
      editMainSection: "0",
      newsList: [{ year: 2000 }, { year: 2001 }, { year: 2002 }],
    };
    this.toggleMainSection = this.toggleMainSection.bind(this);
  }
  toggleMainSection(e) {
    let value = e | 0;
    if (e)
      if (e.currentTarget) {
        value = e.currentTarget.getAttribute("value");
      }
    let sectionButtons = document
      .querySelector("#editMain")
      .querySelector("#topNav").children;

    sectionButtons[this.state.editMainSection].style.background = "transparent";
    sectionButtons[this.state.editMainSection].style.color = "#223F80";
    sectionButtons[value].style.backgroundColor = "#223f80bf";
    sectionButtons[value].style.color = "#FFF";

    let sections = document
      .querySelector("#editMain")
      .querySelectorAll(".section");
    sections.forEach((section) => {
      section.style.display = "none";
    });
    sections[value].style.display = "unset";
    this.setState({ editMainSection: value });
    sessionStorage.setItem("editMainSection", value);
  }
  componentDidMount() {
    this.toggleMainSection(sessionStorage.getItem("editMainSection"));
  }
  render() {
    return (
      <div id="editMain">
        <div id="topNav">
          <button value={0} onClick={this.toggleMainSection}>
            Assets
          </button>
          <button value={1} onClick={this.toggleMainSection}>
            News
          </button>
        </div>
        <AssetsViewer />
        <div id="news" className="section row-1">
          {this.state.newsList.map((news, index) => {
            return <NewsComp data={news} key={index} />;
          })}
        </div>
      </div>
    );
  }
}
export default EditComp;
