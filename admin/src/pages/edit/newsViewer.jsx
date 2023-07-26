import React from "react";
import PropTypes from "prop-types";
import NewsComp from "@components/newsComp";
import yearPhase from "@utils/yearPhase.json";

export default class NewsViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsList: [],
    };
  }
  fetchNewsList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "getNews", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (response.status == 403 || response.status == 401) {
          this.props.setItem({ isAuth: false });
          throw new Error("unAuth");
        }
        return response.json();
      })
      .then((data) => {
        let newsList = [];
        data.forEach((news, index) => {
          newsList.push(
            <NewsComp
              info={news}
              key={index}
              phases={yearPhase[news.year]}
              setItem={this.props.setItem}
              getItem={this.props.getItem}
            />
          );
        });
        this.setState({ newsList: newsList });
      });
  };
  componentDidMount() {
    this.fetchNewsList();
  }
  render() {
    {
      console.log(this.state);
    }
    return (
      <div id="news" className="section row-1">
        {this.state.newsList.map((news) => {
          return news;
        })}
      </div>
    );
  }
}
NewsViewer.propTypes = {
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
