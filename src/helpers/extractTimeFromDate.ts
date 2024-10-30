export default function extractTimeFromDate(date: Date | string) {
  // Check if the input is a valid Date object
  if (!(date instanceof Date)) {
    // throw new TypeError("Input must be a Date object");
    console.log("Input must be a Date object");
    return '';
  } else {

    let hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // const seconds = date.getSeconds().toString().padStart(2, "0");
    const amPm = Number(hours) >= 12 ? "PM" : "AM";
    const hour12 = Number(hours) % 12 || 12; // Convert to 12-hour format (adjust if needed)
    return `${hour12}:${minutes} ${amPm}`;
  }


}
