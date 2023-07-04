export default function roleNumToStr(number) {
  switch (number) {
    case "0":
      return "Executive";
    case "1":
      return "Accountant";
    case "2":
      return "Analyst";
    default:
      return "";
  }
}
