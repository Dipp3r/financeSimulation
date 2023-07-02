import React from "react";
import Alarmclock from "@assets/images/Alarmclock.svg";
// import Export from "@assets/images/Export.svg";
import PropTypes from "prop-types";
export default class NewsComp extends React.Component {
  render() {
    return (
      <div className="newsComp">
        <div id="first">
          <p id="year">{this.props.info.year}</p>
          <p>Open phase</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" defaultValue={this.props.info.phase1} />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Market update</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" defaultValue={this.props.info.phase2} />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Breaking news</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" defaultValue={this.props.info.phase3} />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Super breaking news</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" defaultValue={this.props.info.phase4} />
          </div>
        </div>
      </div>
    );
  }
}
NewsComp.propTypes = {
  info: PropTypes.object.isRequired,
};
