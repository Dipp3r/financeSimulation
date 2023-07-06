import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/news.scss";
import Arrow_left from "@assets/images/Arrow_left.svg";
import Time from "@components/time";
import point from "@assets/images/bullet_point.svg";
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
          </div>
          <p>News</p>
          <Time />
        </div>
        <div id="main">
          <div id="rotate">
            <p>Super breaking news</p>
            <p>Super breaking news</p>
            <p>Super breaking news</p>
          </div>
          <div id="content">
            <div className="news">
              <img src={point} alt="bullet_point" />
              <p>Shares of Ran Dom Tower Industries surge 5% on MSO licence news ((MSO) licence to provide cable TV services to households.</p>
            </div>
            <div className="news">
              <img src={point} alt="bullet_point" />
              <p>Ran Dom Tower Dialup service soft launch happened in 2015 for partners and employees.</p>
            </div>
          </div>
          <div id="fixed">
            <div className="clicked"></div>
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
