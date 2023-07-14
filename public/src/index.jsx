import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import PropTypes from "prop-types";

import InitialComp from "@pages/signInAndSignUp/initial";

import MainComp from "@pages/main";
import RemovedComp from "@pages/removed";
import ErrorComp from "@pages/error";
import * as serviceWorkerRegistration from "@utils/serviceWorkerRegistration";

// const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class IndexComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: [],
      year: Number.parseInt(localStorage.getItem("year")),
      newNotification: false,
    };
  }
  setItem = (name, value) => {
    this.setState({ [name]: value }, () => {
      console.log(this.state);
    });
  };
  getItem = (name) => {
    return this.state[name];
  };
  render() {
    return (
      <BrowserRouter>
        <Routes>
          {/* <Route path="*" index element={<ErrorComp />} /> */}
          <Route
            path="/login/:groupid"
            element={
              <InitialComp setItem={this.setItem} getItem={this.getItem} />
            }
          />
          <Route
            path="/"
            element={<MainComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route path="/removed" element={<RemovedComp />} />
          <Route path="/*" element={<ErrorComp />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexComp />);
serviceWorkerRegistration.register();
// update session set year = 2099,phase = 1,_2100 = 0,_2101 = 0,_2102 = 0,_2103 = 0,_2104 = 0,_2105 = 0,_2106 = 0,start = 0;
// update "group" set _2100 = 0,_2101 = 0,_2102 = 0,_2103 = 0,_2104 = 0,_2105 = 0,_2106 = 0,cash = 0;
// truncate table transaction;
// truncate table investment;
