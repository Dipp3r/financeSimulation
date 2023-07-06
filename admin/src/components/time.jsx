import React from "react";
import PropTypes from "prop-types";
import Alarmclock from "@assets/images/Alarmclock.svg";

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minute: 5,
      second: 0,
      time: "05:00",
      isRunning: false,
      countDownFunc: () => {
        let obj = {};
        obj.minute = this.state.minute;
        obj.second = this.state.second;
        obj.second -= 1;
        if (obj.second < 0) {
          obj.second = 59;
          obj.minute--;
        }
        obj.time = `${obj.minute.toString().padStart(2, "0")}:${obj.second
          .toString()
          .padStart(2, "0")}`;
        this.setState(obj);
        if (
          !this.props.isRunning ||
          obj.minute < 0 ||
          (obj.minute <= 0 && obj.second <= 0)
        ) {
          let value = this.props.time;
          value.replace(/[^0-9:]/g, "");
          let values = value.split(":");
          this.setState({
            time: this.props.time,
            minute: Number.parseInt(values[0]),
            second: Number.parseInt(values[1]),
          });
          clearInterval(this.state.countDownIntervalKey);
        } else {
          this.props.timeChange(obj.time);
        }
      },
      countDownIntervalKey: 0,
    };
  }
  inputFormate = (event) => {
    if (this.state.isRunning) {
      event.currentTarget.blur();
      return;
    }
    let value = event.currentTarget.value;
    value.replace(/[^0-9:]/g, "");
    let values = value.split(":");
    let minute, second;
    if (values.length == 2) [minute, second] = values;
    minute ??= 0;
    second ??= 0;
    if (Number.parseInt(minute) > 60) minute = 60;
    if (Number.parseInt(second) > 60) second = 60;
    this.setState({ time: `${minute.toString()}:${second.toString()}` });
    // event.currentTarget.value = `${minute.toString()}:${second.toString()}`;
  };
  fixTimer = (event) => {
    if (this.state.isRunning) {
      event.currentTarget.blur();
      return;
    }
    let value = event.currentTarget.value;
    value.replace(/[^0-9:]/g, "");
    let values = value.split(":");
    this.setState({
      time: `${values[0].toString().padStart(2, "0")}:${values[1]
        .toString()
        .padStart(2, "0")}`,
    });
  };
  init = () => {
    let obj = {};
    let time = this.props.time.split(":");
    obj.minute = Number.parseInt(time[0]);
    obj.second = Number.parseInt(time[1]);
    obj.time = this.props.time;
    obj.isRunning = this.props.isRunning;
    let countDownIntervalKey = localStorage.getItem("countDownIntervalKey");
    if (countDownIntervalKey) clearInterval(countDownIntervalKey);
    if (this.props.isRunning)
      countDownIntervalKey = setInterval(this.state.countDownFunc, 1000);
    localStorage.setItem("countDownIntervalKey", countDownIntervalKey);
    this.setState(obj);
  };
  componentDidUpdate(prevProps) {
    if (
      this.props.time !== prevProps.time ||
      this.props.isRunning !== prevProps.isRunning
    ) {
      this.setState(
        { time: this.props.time, isRunning: this.props.isRunning },
        () => this.init()
      );
    }
  }
  componentDidMount() {
    this.init();
  }
  render() {
    return (
      <>
        <img src={Alarmclock} alt="timer" />
        <input
          type="text"
          value={this.state.time}
          onInput={this.inputFormate}
          onFocus={this.fixTimer}
        />
      </>
    );
  }
}

Time.propTypes = {
  time: PropTypes.string.isRequired,
  isRunning: PropTypes.bool.isRequired,
  timeChange: PropTypes.func.isRequired,
};

// UPDATE session SET phase=1 WHERE sessionid > 1;
// UPDATE session SET start=0 WHERE sessionid > 1;
// UPDATE session SET year=2099 WHERE sessionid > 1;
