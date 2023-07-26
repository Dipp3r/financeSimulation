import React from "react";
import PropTypes from "prop-types";
import edit_doc from "@assets/images/edit_doc.svg";

export default class AssetsComp extends React.Component {
  renameAsset = (event) => {
    let target = event.currentTarget;
    target.blur();
    if (
      target.value == "" ||
      target.value == " " ||
      target.value == this.props.info.name
    )
      return "";
    fetch(import.meta.env.VITE_API_SERVER_URL + "renameAsset", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        assetId: this.props.info.id,
        new_name: target.value.trim(),
      }),
    }).then((response) => {
      if (response.status == 403 || response.status == 401) {
        this.props.setItem({ isAuth: false });
        throw new Error("unAuth");
      }
      this.props.info.name = target.value.trim();
    });
  };
  render() {
    return (
      <div>
        <p>{(this.props.index < 10 ? "0" : "") + this.props.index}</p>
        <button
          onClick={() =>
            this.props.toggleaddInfoPrompt({
              assetId: this.props.info.id,
              assetName: this.props.info.name,
            })
          }
        >
          <img
            src={edit_doc}
            alt="edit document"
            height="25px"
            style={{ marginRight: "-15px", marginLeft: "20px" }}
          />
        </button>
        <input
          className="assetName"
          defaultValue={this.props.info.name}
          onBlur={this.renameAsset}
          onKeyDown={(event) => {
            return event.key === "Enter" ? event.target.blur() : "";
          }}
        />
      </div>
    );
  }
}

AssetsComp.propTypes = {
  index: PropTypes.number,
  info: PropTypes.object.isRequired,
  toggleaddInfoPrompt: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
