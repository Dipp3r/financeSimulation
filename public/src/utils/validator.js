function validator(data) {
  let { name, mobile, password } = data;
  const nameRegex = /^[a-zA-Z_]+$/;
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
  const mobileRegex = /^([0-9]+){10}$/;
  return !name
    ? {
        mobile: mobileRegex.test(mobile),
        password: passwordRegex.test(password),
      }
    : {
        name: nameRegex.test(name),
        mobile: mobileRegex.test(mobile),
        password: passwordRegex.test(password),
      };
}

export default validator;
