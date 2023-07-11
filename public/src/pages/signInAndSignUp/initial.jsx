import PropTypes from "prop-types";
import "@assets/styles/signup.scss";
import "@assets/styles/signupForm.scss";

import SigninComp from "./singinComp";
import SignupComp from "./signupComp";
// import { WithRouter } from "@components/routingWrapper";
// const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function InitialComp() {
  const [isSignin, setIsSignin] = useState(true);
  const [groupid, setGroupid] = useState("");

  const toggleInitPage = () => {
    setIsSignin(!isSignin);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (
      localStorage.getItem("userid") &&
      localStorage.getItem("groupid") === window.location.href.split("/").pop()
    ) {
      navigate("../../");
    } else {
      setGroupid(String(window.location.href.split("/").pop()));
    }
  }, [navigate]);

  return (
    <>
      {isSignin ? (
        <SigninComp toggleInitPage={toggleInitPage} groupid={groupid} />
      ) : (
        <SignupComp toggleInitPage={toggleInitPage} groupid={groupid} />
      )}
    </>
  );
}

InitialComp.propTypes = {
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
export default InitialComp;
