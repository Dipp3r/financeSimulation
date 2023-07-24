import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/news.scss";
import Arrow_left from "@assets/images/Arrow_left.svg";
import Time from "@components/time";
import NewsListComp from "../components/newsListComp";
import getPhasestring from "@utils/getPhaseString";
class NewsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsListComps: [[]],
      currentPos: 0,
      isScrollLock: false,
    };
  }
  fetchNews = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        year: localStorage.getItem("newsYear"),
        phase: localStorage.getItem("newsPhase"),
      }),
    })
      .then(async (response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          // throw new Error();
        }
      })
      .then((data) => {
        let mainList = [];
        let list = [];
        let minNewsHieght = 130; // higher number will have lower news per page
        let count = Number.parseInt(window.innerHeight / minNewsHieght);
        data.news.forEach((element, index) => {
          console.log(index % count == 0, index >= count);
          if (index % count == 0 && index >= count) {
            mainList.push(list);
            list = [];
          }
          list.push(<NewsListComp info={element} key={index} />);
        });
        mainList.push(list);
        this.setState({ ...data, newsListComps: mainList }, () =>
          console.log(this.state)
        );
      });
  };
  setScroll = (event) => {
    let innerRange = 0.01;
    let target = event.currentTarget;
    let count = Number.parseInt(target.scrollLeft / window.innerWidth);
    let CurrentCardPos = window.innerWidth * count;
    let diff = (target.scrollLeft / window.innerWidth) % 1;
    let content = document.querySelector("#content");
    console.log(this.state.isScrollLock);
    if (diff <= innerRange + 0.02 || diff >= 1 - (innerRange + 0.02)) {
      this.setState({ isScrollLock: false });
      content.style.overflow = "scroll";
      return;
    }
    let upperMiddle = CurrentCardPos + window.innerWidth * 0.45;
    let upperBound = CurrentCardPos + window.innerWidth * innerRange;
    let lowerMiddle = CurrentCardPos + window.innerWidth * (1 - 0.45);
    let lowerBound = CurrentCardPos + window.innerWidth * (1 - innerRange);
    // console.log(
    //   target.scrollLeft,
    //   upperMiddle,
    //   upperBound,
    //   lowerMiddle,
    //   lowerBound,
    //   target.scrollLeft < lowerBound,
    //   target.scrollLeft > lowerMiddle,
    //   target.scrollLeft < upperMiddle,
    //   target.scrollLeft > upperBound
    // );
    if (
      !this.state.isScrollLock &&
      target.scrollLeft < upperMiddle &&
      target.scrollLeft > upperBound
    ) {
      if (count + 1 >= this.state.newsListComps.length) return;
      console.log(CurrentCardPos, "up", count + 1);
      this.setState({ currentPos: count + 1, isScrollLock: true });
      content.style.overflow = "hidden";
      target.scrollLeft = CurrentCardPos + window.innerWidth;
    } else if (
      !this.state.isScrollLock &&
      target.scrollLeft > lowerMiddle &&
      target.scrollLeft < lowerBound
    ) {
      console.log(CurrentCardPos, "down", count);
      this.setState({ currentPos: count, isScrollLock: true });
      content.style.overflow = "hidden";
      target.scrollLeft = CurrentCardPos;
    }
  };
  componentDidMount = () => {
    this.fetchNews();
  };
  render() {
    return (
      <div id="news">
        <div id="topBar">
          <div id="back">
            <img
              src={Arrow_left}
              alt="back_arrow"
              onClick={() => {
                setTimeout(
                  () => this.props.toggleMainDisplay("dashboard"),
                  400
                );
              }}
            />
          </div>
          <p className="pageTitle">News</p>
          <Time />
        </div>
        <div id="main">
          <div id="rotate">
            <div id="listOne">
              <p>{getPhasestring(localStorage.getItem("phase"))}</p>
              <p>{getPhasestring(localStorage.getItem("phase"))}</p>
              <p>{getPhasestring(localStorage.getItem("phase"))}</p>
            </div>
            <div id="listTwo">
              <p>{getPhasestring(localStorage.getItem("phase"))}</p>
              <p>{getPhasestring(localStorage.getItem("phase"))}</p>
              <p>{getPhasestring(localStorage.getItem("phase"))}</p>
            </div>
          </div>
          <div id="content" onScroll={this.setScroll}>
            {this.state.newsListComps.map((news, index) => {
              return (
                <div key={index} className="newsSheet">
                  {news.map((element) => {
                    return element;
                  })}
                </div>
              );
            })}
          </div>
          <div id="fixed">
            {this.state.newsListComps.map((news, index) => {
              return (
                <div
                  className={this.state.currentPos == index ? "clicked" : ""}
                  key={index}
                ></div>
              );
            })}
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
