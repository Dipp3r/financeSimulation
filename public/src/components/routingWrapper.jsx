import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";

export const WithRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    var changeRoute = (e) => {
      var URL = "";
      if (typeof e == "string") {
        URL = e;
      } else {
        URL = e.currentTarget.getAttribute("value");
        if (URL == null) URL = e.target.value;
      }
      console.log(URL);
      localStorage.setItem("mainDisplay", URL.split("/").pop());
      navigate(URL);
    };
    // eslint-disable-next-line react/prop-types
    return <Component navigate={changeRoute} key={props.id} {...props} />;
  };

  return Wrapper;
};
WithRouter.propTypes = {
  id: PropTypes.number.isRequired,
};
