export function padStart(
  string: string,
  targetLength: number,
  padString: string = " "
): string {
  string = String(string);
  targetLength = targetLength >> 0; // truncate if number or convert non-number to 0;
  padString = String(padString);

  if (string.length >= targetLength) {
    return string;
  }

  targetLength = targetLength - string.length;
  if (targetLength > padString.length) {
    padString += padString.repeat(Math.ceil(targetLength / padString.length)); // append to original to ensure we are longer than needed
  }

  return padString.slice(0, targetLength) + string;
}
