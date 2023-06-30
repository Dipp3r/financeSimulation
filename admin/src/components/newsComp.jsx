import React from "react";
import Alarmclock from "@assets/images/Alarmclock.svg";
// import Export from "@assets/images/Export.svg";
export default class NewsComp extends React.Component {
  render() {
    return (
      <div className="newsComp">
        <div id="first">
          <p id="year">{2001}</p>
          <p>Open phase</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" value="05:00" />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Market update</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" value="05:00" />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Breaking news</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" value="05:00" />
          </div>
        </div>
        <div className="newsUpdate">
          <p>Super breaking news</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <input type="time" value="05:00" />
          </div>
        </div>
      </div>
    );
  }
}
