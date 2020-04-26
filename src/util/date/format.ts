export function getYYYYMMddHHmmssDateFormat(localUTCDate: Date): string {
  const month2Digit = makeDoubleDigit(localUTCDate.getMonth() + 1);
  const date2Digit = makeDoubleDigit(localUTCDate.getDate());
  const hour2Digit = makeDoubleDigit(localUTCDate.getHours());
  const mins2Digit = makeDoubleDigit(localUTCDate.getMinutes());
  const sec2Digit = makeDoubleDigit(localUTCDate.getSeconds());

  return `${localUTCDate.getFullYear()}${month2Digit}${date2Digit}${hour2Digit}${mins2Digit}${sec2Digit}`;
}

export function makeDoubleDigit(currentDigit: number): string {
  return ('0' + currentDigit).slice(-2);
}
