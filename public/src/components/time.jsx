import React from "react";
import Alarmclock from "@assets/images/Alarmclock.svg";

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minute: 5,
      second: 0,
      countDownFunc: () => {
        let obj = {};
        obj.minute = Number.parseInt(localStorage.getItem("minute"));
        obj.second = Number.parseInt(localStorage.getItem("second")) - 1;
        if (obj.second < 0) {
          obj.second = 59;
          obj.minute--;
        }
        // console.log(obj);
        if (obj.minute < 0 || (obj.minute <= 0 && obj.second <= 0)) {
          //timer ended
          clearInterval(this.state.countDownIntervalKey);
        } else {
          localStorage.setItem("minute", obj.minute);
          localStorage.setItem("second", obj.second);
          this.setState(obj);
        }
      },
      countDownIntervalKey: 0,
    };
  }
  componentDidMount() {
    let obj = {};
    obj.minute = localStorage.getItem("minute");
    obj.second = localStorage.getItem("second") - 1;
    let countDownIntervalKey = localStorage.getItem("countDownIntervalKey");
    if (countDownIntervalKey) clearInterval(countDownIntervalKey);
    countDownIntervalKey = setInterval(this.state.countDownFunc, 1000);
    localStorage.setItem("countDownIntervalKey", countDownIntervalKey);
    this.setState(obj);
  }
  render() {
    return (
      <div id="timer">
        <img src={Alarmclock} alt="timer" />
        <p>
          {this.state.minute
            ? this.state.second
              ? this.state.minute.toString().padStart(2, "0") +
                ":" +
                this.state.second.toString().padStart(2, "0")
              : this.state.minute.toString().padStart(2, "0") + ":" + "00"
            : this.state.second
            ? "00" + ":" + this.state.second.toString().padStart(2, "0")
            : "00" + ":" + "00"}
        </p>
      </div>
    );
  }
}
