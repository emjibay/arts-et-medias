module.exports = humanReadableFileSizeSI;


function humanReadableFileSizeSI(bytes) {
  const units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

  const exponent = Math.floor(Math.log(bytes) / Math.log(1024));
  const significand = (bytes / Math.pow(1024, exponent)).toFixed(1);

  return `${significand} ${units[exponent]}B`;
}
