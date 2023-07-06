import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/news.scss";
import Arrow_left from "@assets/images/Arrow_left.svg";
import Alarmclock from "@assets/images/Alarmclock.svg";

class NewsComp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="news">
        <div id="topBar">
          <div>
            <img
              src={Arrow_left}
              alt="back_arrow"
              onClick={() => {
                this.props.toggleMainDisplay("dashboard");
              }}
            />
            <p>Super breaking news</p>
          </div>
          <div id="timer">
            <img src={Alarmclock} alt="timer" />
            <p>05:00</p>
          </div>
        </div>
        <div id="main">
          <div id="fixed">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}
export default NewsComp;
NewsComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
};
