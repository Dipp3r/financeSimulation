/* eslint-disable react/no-unescaped-entities */
import React from "react";
import PropTypes from "prop-types";
// import deleteIcon from "@assets/images/delete.png";
import close from "@assets/images/cross.svg";
// import MDEditor from "@uiw/react-md-editor";
export default class AddInfoPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  handleChange = (event) => {
    let value = event.currentTarget.value;
    // value = value
    //   .replace(/(?<!`)_asset_(?!`)/g, "`_asset_`")
    //   .replace(/(?<!`)_asset_`/, "`_asset_`")
    //   .replace(/`_asset_(?!`)/, "`_asset_`");
    this.setState({ value: value });
  };
  getInfo = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "assetInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ assetid: this.props.assetId }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ value: data.info == null ? "" : data.info });
      });
  };
  setInfo = () => {
    if (!this.state.value || this.state.value == "") return;
    fetch(import.meta.env.VITE_API_SERVER_URL + "updateInfo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        assetid: this.props.assetId,
        text: this.state.value,
      }),
    });
  };
  componentDidUpdate(prevProps) {
    if (this.props.display !== prevProps.display) {
      // console.log(this.props);
      this.getInfo();
    }
  }
  render() {
    return (
      <div id="addInfoPrompt" style={{ display: this.props.display }}>
        <div id="InfoBox">
          <div id="first">
            <p></p>
            <p>{this.props.assetName}</p>
            <button
              id="closeButton"
              onClick={() => this.props.toggleaddInfoPrompt()}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <hr />
          <div id="second">
            <p>
              Note : use '_asset_' in place of the asset name(replace all the{" "}
              {this.props.assetName} by _asset_)
            </p>
          </div>
          <div id="third">
            {/* <MDEditor
              id="textarea"
              value={this.state.value}
              autoFocus={false}
              onChange={this.handleChange}
              previewOptions={{
                skipHtml: true,
                escapeHtml: true,
                transformLinkUri: null,
                linkTarget: "_blank",
              }}
            /> */}
            <textarea
              id="textarea"
              placeholder="enter the asset note here"
              onInput={this.handleChange}
              value={this.state.value}
              onBlur={this.setInfo}
              // value={this.state.value}
            />
          </div>
        </div>
      </div>
    );
  }
}

AddInfoPrompt.propTypes = {
  display: PropTypes.string.isRequired,
  assetId: PropTypes.number.isRequired,
  assetName: PropTypes.string.isRequired,
  toggleaddInfoPrompt: PropTypes.func.isRequired,
};
