const small = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function words(value: number): string {
  if (value < 0) return `minus ${words(-value)}`;
  if (value < 20) return small[value];
  if (value < 100)
    return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${small[value % 10]}` : ""}`;
  return `${small[Math.floor(value / 100)]} hundred${value % 100 ? ` ${words(value % 100)}` : ""}`;
}

/** Keep captions numeric, but prevent Hindi voices from reading digits in Hindi. */
export function narrationNumbers(text: string): string {
  return text.replace(/-?\b\d+(?:\.\d+)?\b/g, (token) => {
    const value = Number(token);
    if (Math.abs(value) > 999) return token;
    const [integer, fraction] = token.split(".");
    return (
      words(Number(integer)) +
      (fraction
        ? ` point ${[...fraction].map((digit) => small[Number(digit)]).join(" ")}`
        : "")
    );
  });
}
