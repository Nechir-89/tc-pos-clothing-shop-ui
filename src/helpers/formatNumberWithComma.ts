export default function formatNumberWithComma(n: number) {
  // Handle non-numeric input gracefully
  if (isNaN(n)) {
    return "Invalid number";
  }

  // Remove any existing decimal and currency symbol (optional)
  const absoluteNumber = Math.abs(n);
  const numberWithoutDecimals = Math.floor(absoluteNumber).toString();

  // Add comma separators for thousands (or customize based on locale)
  const parts = numberWithoutDecimals.split('').reverse();
  let formattedNumber = "";
  for (let i = 0; i < parts.length; i++) {
    formattedNumber += (i % 3 === 0 && i > 0 ? ',' : '') + parts[i];
  }

  // Prepend a minus sign for negative numbers
  formattedNumber = n < 0 ? '-' + formattedNumber : formattedNumber;

  return formattedNumber.split('').reverse().join('');
}
