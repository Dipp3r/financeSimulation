import React from "react";
import PropTypes from "prop-types";
import point from "@assets/images/bullet_point.svg";
import ReactHtmlParser from "react-html-parser";
export default class NewsListComp extends React.Component {
  render() {
    return (
      <div className="news">
        <img src={point} alt="bullet_point" />
        <p>{ReactHtmlParser(this.props.info)}</p>
      </div>
    );
  }
}
NewsListComp.propTypes = {
  info: PropTypes.string.isRequired,
};
