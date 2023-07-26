import React from "react";
import AssetsComp from "./assetComp";
import AddInfoPrompt from "./addInfo";
import PropTypes from "prop-types";

export default class AssetsViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsList: [],
      currentActiveAssetButton: "0",
      toggleaddInfoPromptDisplay: "none",
      assetId: 0,
      assetName: "",
    };
  }
  displayList = () => {};
  toggleAssetSection = (e) => {
    let assetButtons = document.querySelector("#top").children;
    let currentActiveAssetButton = "0";
    if (e != undefined) {
      currentActiveAssetButton = e.currentTarget.getAttribute("value");
    }
    assetButtons[this.state.currentActiveAssetButton].style.borderBottomColor =
      "#8492B3";
    assetButtons[currentActiveAssetButton].style.borderBottomColor = "#223F80";
    let displayList = [];
    switch (currentActiveAssetButton) {
      case "1":
        displayList = this.state.mutualFund;
        break;
      case "2":
        displayList = this.state.commodity;
        break;
      case "0":
      default:
        displayList = this.state.stock;
    }
    this.setState({
      currentActiveAssetButton: currentActiveAssetButton,
      assetsList: displayList,
    });
  };
  fetchList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "getAssets", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (response.status == 403 || response.status == 401) {
          this.props.setItem({ isAuth: false });
          throw new Error("unAuth");
        }
        return response.json();
      })
      .then((data) => {
        this.setState(data, () => {
          // console.log(this.state);
          this.toggleAssetSection();
        });
      });
  };
  toggleaddInfoPrompt = (obj = {}) => {
    let toggleaddInfoPromptDisplay =
      this.state.toggleaddInfoPromptDisplay == "none" ? "flex" : "none";
    this.setState({
      ...obj,
      toggleaddInfoPromptDisplay: toggleaddInfoPromptDisplay,
    });
  };
  componentDidMount() {
    this.fetchList();
  }
  render() {
    return (
      <div id="assets" className="section">
        <AddInfoPrompt
          display={this.state.toggleaddInfoPromptDisplay}
          toggleaddInfoPrompt={this.toggleaddInfoPrompt}
          assetId={this.state.assetId}
          assetName={this.state.assetName}
          setItem={this.props.setItem}
          getItem={this.props.getItem}
        />

        <div id="top">
          <button value="0" onClick={this.toggleAssetSection}>
            Stocks
          </button>
          <button value="1" onClick={this.toggleAssetSection}>
            Mutual funds
          </button>
          <button value="2" onClick={this.toggleAssetSection}>
            Commodities
          </button>
        </div>
        <div id="editMainSection">
          {this.state.assetsList.map((assets, index) => {
            return (
              <AssetsComp
                key={assets.id}
                index={index + 1}
                info={assets}
                toggleaddInfoPrompt={this.toggleaddInfoPrompt}
                setItem={this.props.setItem}
                getItem={this.props.getItem}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
AssetsViewer.propTypes = {
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
