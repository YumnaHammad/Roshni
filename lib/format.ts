const pkr = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

/** Formats a number as PKR, e.g. "Rs 3,450". Same output on server and client. */
export const formatPrice = (amount: number) => pkr.format(amount).replace(/^PKR\s?/, "Rs ");
