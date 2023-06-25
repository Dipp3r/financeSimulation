import React, { useState } from "react";
import "../styles/loginForm.css";
import validator from ".././validator";

const FormLogin = ({toggleMainDisplay}) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    nameError: "",
    passwordError: "",
    mobileError: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validator(Object.values(formData).slice(0, 3));
    if (formData.name.trim() === "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nameError: "*This field is required",
      }));
    } else {
      if (!isValid.name) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          nameError: "*Invalid name",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          nameError: "",
        }));
      }
    }
    if (formData.password.trim() === "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        passwordError: "*This field is required",
      }));
    } else {
      if (!isValid.password) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          passwordError:
            "*Password must contain a minimum of 8 characters including atleast an uppercase, a lowercase and a digit",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          passwordError: "",
        }));
      }
    }

    if (formData.mobile.trim() === "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        mobileError: "*This field is required",
      }));
    } else {
      if (!isValid.mobile) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          mobileError: "*Enter a valid mobile number",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          mobileError: "",
        }));
      }
    }
    try {
        if(isValid.name && isValid.mobile && isValid.password){
          console.log("hello working")
            const response = await fetch("http://localhost:3003/login/576397",{
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(Object.fromEntries(Object.entries(formData).slice(0, 3)))
            });
            console.log(response)
            if(response.ok){
                const data = await response.json().then(data=>{console.log(data)});
                toggleMainDisplay("dashboard",data);
            }
            else{
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    passwordError: "*Incorrect Password or username",
                  }));
            }
        }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="formInput"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <p className="error">{formData.nameError}</p>
      <input
        className="formInput"
        type="text"
        name="mobile"
        placeholder="1234567890"
        value={formData.mobile}
        onChange={handleInputChange}
      />
      <p className="error">{formData.mobileError}</p>
      <input
        className="formInput"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <p className="error">{formData.passwordError}</p>
      <button id="loginButton" type="submit">
        Login
      </button>
    </form>
  );
};

export default FormLogin;
