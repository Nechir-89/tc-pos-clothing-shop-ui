export default function extractDateFromDate(date: Date | string) {
  // Check if the input is a valid Date object
  if (!(date instanceof Date)) {
    // throw new TypeError("Input must be a Date object");
    console.log("Input must be a Date object");
    return '';
  }

  const year = date.getFullYear()
  const monthDay = date.getDate()
  const month = date.getMonth()

  return `${year}/${month+1}/${monthDay}`;
}
