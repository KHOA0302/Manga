function UseFormatNum(num, method = false, precision = 2) {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found && !method) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  } else if (method) {
    var output = [];

    for (; num >= 1000; num = Math.floor(num / 1000)) {
      output.unshift(String(num % 1000).padStart(3, "0"));
    }
    output.unshift(num);
    return output.join(".");
  }

  return num;
}

export default UseFormatNum;
