import React from "react";
import * as serviceWorkerRegistration from "@utils/serviceWorkerRegistration";
import ReactDOM from "react-dom/client";
// import PropTypes from "prop-types";
import SellComp from "@pages/buySell";
import Dashboard from "@pages/dashboard/dashboard";
import InitialComp from "@pages/signInAndSignUp/initial";
import PortfolioComp from "@pages/portfolio";
import TeamComp from "@pages/team/team";

import NewsComp from "@pages/news";
import AssetInfoComp from "@pages/assetInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
import { HashRouter } from "react-router-dom";
import RemovedComp from "./pages/removed";
// import { WithRouter } from "@components/routingWrapper";
// import { useNavigate } from "react-router-dom";
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
      <BrowserRouter history={HashRouter}>
        <Routes history={HashRouter}>
          {/* <Route path="*" index element={<ErrorComp />} /> */}
          <Route
            path="/:groupid"
            element={
              <InitialComp setItem={this.setItem} getItem={this.getItem} />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                setItem={this.setItem}
                getItem={this.getItem}
                newNotification={this.state.newNotification}
              />
            }
          />
          <Route
            path="/portfolio"
            element={
              <PortfolioComp setItem={this.setItem} getItem={this.getItem} />
            }
          />
          <Route
            path="/team"
            element={<TeamComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route
            path="/purchase"
            element={<SellComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route
            path="/purchase"
            element={<SellComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route
            path="/news"
            element={<NewsComp setItem={this.setItem} getItem={this.getItem} />}
          />
          <Route path="/assetInfo" element={<AssetInfoComp />} />
          <Route path="/removed" element={<RemovedComp />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexComp />);
serviceWorkerRegistration.register();
//update session set year = 2099,phase = 1,_2100 = 0,_2101 = 0,_2102 = 0,_2103 = 0,_2104 = 0,_2105 = 0,_2106 = 0,start = 0;
