export default function getPhaseString(number) {
  switch (number) {
    case 1:
    default:
      return "Open Phase";
    case 2:
      return "Market Update";
    case 3:
      return "Breaking News";
    case 4:
      return "Super Break News";
  }
}
