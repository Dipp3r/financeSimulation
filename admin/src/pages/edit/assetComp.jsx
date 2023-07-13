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
      },
      body: JSON.stringify({
        assetId: this.props.info.id,
        new_name: target.value.trim(),
      }),
    }).then(() => {
      this.props.info.name = target.value.trim();
    });
  };
  render() {
    return (
      <div>
        <p>{(this.props.index < 10 ? "0" : "") + this.props.index}</p>
        <button>
          <img
            src={edit_doc}
            alt="edit document"
            height="25px"
            style={{ "margin-right": "-15px", "margin-left": "20px" }}
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
};
