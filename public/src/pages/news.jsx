import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/news.scss";
import Arrow_left from "@assets/images/Arrow_left.svg";
import Time from "@components/time";
import NewsListComp from "../components/newsListComp";

class NewsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsListComps: [[], []],
      currentPos: 0,
      isScrollLock: false,
    };
  }
  fetchNews = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupid: localStorage.getItem("groupid") }),
    })
      .then(async (response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          // throw new Error();
        }
      })
      .then((data) => {
        console.log(data);
        data.news = [
          "<b>Ran dom Tower</b> buying controlling stake in Hm acquires substantial stake in media startup NEJ",
          "<b>Blade Bull Finance</b> raises Rs 23,600 crore i<b>Blade Bull Finance</b> raises another Rs 200 cr.",
          "<b>Ran dom Tower</b> buying controlling stake in Hm acquires substantial stake in media startup NEJ",

          "<b>Blade Bull Finance</b> raises Rs 23,600 crore i…>Blade Bull Finance</b> raises another Rs 200 cr.",
          "<b>Ran dom Tower</b> buying controlling stake in H…m acquires substantial stake in media startup NEJ",
          "<b>Blade Bull Finance</b> raises Rs 23,600 crore i…>Blade Bull Finance</b> raises another Rs 200 cr.",

          "<b>Ran dom Tower</b> buying controlling stake in H…m acquires substantial stake in media startup NEJ",
          "<b>Blade Bull Finance</b> raises Rs 23,600 crore i…>Blade Bull Finance</b> raises another Rs 200 cr.",
          "<b>Ran dom Tower</b> buying controlling stake in H…m acquires substantial stake in media startup NEJ",

          "<b>Blade Bull Finance</b> raises Rs 23,600 crore i…>Blade Bull Finance</b> raises another Rs 200 cr.",
        ];
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
    let innerRange = 0.08;
    let target = event.currentTarget;
    let count = Number.parseInt(target.scrollLeft / window.innerWidth);
    let CurrentCardPos = window.innerWidth * count;
    let diff = (target.scrollLeft / window.innerWidth) % 1;
    console.log(this.state.isScrollLock);
    if (diff <= innerRange - 0.05 || diff >= 1 - (innerRange - 0.05)) {
      this.setState({ isScrollLock: false });
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
      console.log(CurrentCardPos, "up", count + 1);
      this.setState({ currentPos: count + 1, isScrollLock: true });
      target.scrollLeft = CurrentCardPos + window.innerWidth * 0.98;
    } else if (
      !this.state.isScrollLock &&
      target.scrollLeft > lowerMiddle &&
      target.scrollLeft < lowerBound
    ) {
      console.log(CurrentCardPos, "down", count);
      this.setState({ currentPos: count, isScrollLock: true });
      target.scrollLeft = CurrentCardPos - window.innerWidth * 0.02;
    }
  };
  componentDidMount = () => {
    this.fetchNews();
  };
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
