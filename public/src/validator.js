function validator([name, mobile, password]) {
    const nameRegex = /^[a-zA-Z_]+[a-zA-Z0-9]*$/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    const mobileRegex = /^[0-9]+.{9}$/;
    return {
      name: nameRegex.test(name),
      mobile: mobileRegex.test(mobile),
      password: passwordRegex.test(password),
    };
}

export default validator;