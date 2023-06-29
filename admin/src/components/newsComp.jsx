import React from "react";
import Alarmclock from "@assets/images/Alarmclock.svg";
import Export from "@assets/images/Export.svg";
export default class NewsComp extends React.Component {
  render() {
    return (
      <div className="newsComp">
        <div id="first">
          <p id="year">{this.state.year}</p>
          <p>Open phase</p>
          <div>
            <img src={Alarmclock} alt="alarmclock" />
            <p>05:00</p>
          </div>
        </div>
        <div className="newsUpdate">
          <p>Market update</p>
          <div>
            <img src={Alarmclock} alt="" />
            <p>05:00</p>
          </div>
          <button>
            <div>
              <img src={Export} alt="Export" />
              <p>Upload</p>
            </div>
            <input type="file" placeholder="upload" />
          </button>
        </div>
        <div className="newsUpdate">
          <p>Breaking news</p>
          <div>
            <img src={Alarmclock} alt="" />
            <p>05:00</p>
          </div>
          <button>
            <div>
              <img src={Export} alt="Export" />
              <p>Upload</p>
            </div>
            <input type="file" placeholder="upload" />
          </button>
        </div>
        <div className="newsUpdate">
          <p>Super breaking news</p>
          <div>
            <img src={Alarmclock} alt="" />
            <p>05:00</p>
          </div>
          <button>
            <div>
              <img src={Export} alt="Export" />
              <p>Upload</p>
            </div>
            <input type="file" placeholder="upload" />
          </button>
        </div>
      </div>
    );
  }
}
