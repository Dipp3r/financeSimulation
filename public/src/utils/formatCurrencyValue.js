export default function formatCurrencyValue(value) {
  if (typeof value === "string") {
    value = Number(value.replace(/[^0-9.-]+/g, ""));
  }
  console.log(value);
  const abbreviations = {
    T: 1000000000000,
    B: 1000000000,
    M: 1000000,
    K: 1000,
  };
  let result;
  for (let abbreviation in abbreviations) {
    if (Math.abs(value) > abbreviations[abbreviation]) {
      console.log((value / abbreviations[abbreviation]).toFixed(2));
      result =
        Number((value / abbreviations[abbreviation]).toFixed(2)).toString() +
        abbreviation;
      break;
    }
  }
  result ??= value;
  return result;
}
