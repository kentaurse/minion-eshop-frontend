export const numberFormat = (number) => {
  let string = number.toString();
  let numberLen = string.length;
  const numberString = [];
  for (let i = 0; i < numberLen; i++) {
    numberString.push(string[i]);
  }

  if (numberLen <= 6) {
    return simpleNumberFormat(number);
  }
  if (numberLen > 6 && numberLen < 10) {
    let prefix = [];
    numberString.map((value, index) => {
      if (numberString.length - index + 1 > 6) {
        prefix.push(value);
      }
    });
    let prefixStr = prefix.reduce((total, val, index) => {
      return total + val;
    });
    let prefixNum = Number(prefixStr) / 10;
    return prefixNum + " million";
  }
  if (numberLen > 9 && numberLen < 13) {
    let prefix = [];
    numberString.map((value, index) => {
      if (numberString.length - index + 1 > 9) {
        prefix.push(value);
      }
    });
    let prefixStr = prefix.reduce((total, val, index) => {
      return total + val;
    });
    let prefixNum = Number(prefixStr) / 10;
    let sosubu = (prefixNum * 10 - Math.floor(prefixNum) * 10) / 10;
    sosubu = sosubu === 0 ? "" : "." + sosubu;
    return simpleNumberFormat(Math.floor(prefixNum)) + sosubu + " billion";
  }
  if (numberLen > 12) {
    return numberString[0] + numberString[1] + "e+" + numberLen - 1;
  }
};
const simpleNumberFormat = (number) => {
  let string = number.toString();
  let numberLen = string.length;
  const numberString = [];
  for (let i = 0; i < numberLen; i++) {
    numberString.push(string[i]);
  }
  const stringWithComma = [];
  numberString.reverse().map((item, index, arr) => {
    stringWithComma.push(item);
    if ((index + 1) % 3 === 0 && index !== arr.length - 1) {
      stringWithComma.push(",");
    }
  });
  return stringWithComma.reverse().reduce((total, value, index) => {
    return (total += value);
  });
};
