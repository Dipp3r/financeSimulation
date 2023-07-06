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
      newsListComps: [],
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
          throw new Error();
        }
      })
      .then((data) => {
        console.log(data);
        let list = [];
        data.news.forEach((element, index) => {
          list.push(<NewsListComp info={element} key={index} />);
        });
        this.setState({ ...data, newsListComps: list });
      });
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
          <div id="content">{this.state.newsListComps.map((news) => news)}</div>
          <div id="fixed">
            <div className="clicked"></div>
            <div></div>
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
