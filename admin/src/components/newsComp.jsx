import React from "react";
import Alarmclock from "@assets/images/Alarmclock.svg";
// import Export from "@assets/images/Export.svg";
import PropTypes from "prop-types";
export default class NewsComp extends React.Component {
  inputInput = (event) => {
    let value = event.currentTarget.value;
    value.replace(/[^0-9:]/g, "");
    let values = value.split(":");
    let minute, second;
    if (values.length == 2) [minute, second] = values;
    minute ??= 0;
    second ??= 0;
    if (Number.parseInt(minute) > 60) minute = 60;
    if (Number.parseInt(second) > 60) second = 60;
    event.currentTarget.value = `${minute.toString()}:${second.toString()}`;
  };
  updateTime = (event) => {
    let value = event.currentTarget.value;
    let obj = {};
    obj.year = this.props.info.year;
    obj.phase = event.currentTarget.name;
    obj.time = "00:" + value;
    fetch(import.meta.env.VITE_API_SERVER_URL + "editTime", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  };
  render() {
    return (
      <div className="newsComp">
        <div id="first">
          <p id="year">{this.props.info.year}</p>
          <p>Open phase</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input
              type="text"
              name="1"
              placeholder="mm:ss"
              onInput={this.inputInput}
              onBlur={this.updateTime}
              defaultValue={this.props.info.phase1.slice(3, undefined)}
            />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Market update</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input
              type="text"
              name="2"
              placeholder="mm:ss"
              onInput={this.inputInput}
              onBlur={this.updateTime}
              defaultValue={this.props.info.phase2.slice(3, undefined)}
            />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Breaking news</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input
              type="text"
              name="3"
              placeholder="mm:ss"
              onInput={this.inputInput}
              onBlur={this.updateTime}
              defaultValue={this.props.info.phase3.slice(3, undefined)}
            />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Super breaking news</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input
              type="text"
              name="4"
              placeholder="mm:ss"
              onInput={this.inputInput}
              onBlur={this.updateTime}
              defaultValue={this.props.info.phase4.slice(3, undefined)}
            />
          </div>
        </div>
      </div>
    );
  }
}
NewsComp.propTypes = {
  info: PropTypes.object.isRequired,
};
