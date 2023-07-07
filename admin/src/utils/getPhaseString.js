export default function getPhaseString(number) {
  switch (number) {
    case 0:
    default:
      return "Open Phase";
    case 1:
      return "Market Update";
    case 2:
      return "Breaking News";
    case 3:
      return "Super Break News";
  }
}
