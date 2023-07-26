function secondsToHMS(seconds) {
  if (!seconds) {
    return;
  }
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  var HH = hours < 10 ? "0" + hours : hours;
  var MM = minutes < 10 ? "0" + minutes : minutes;
  var SS = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return HH + ":" + MM + ":" + SS;
}
module.exports = secondsToHMS;