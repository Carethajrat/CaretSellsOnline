import { CURRENCY } from "../config/feed.js";

const formatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: "currency",
  currency: CURRENCY.code,
});

// Money is held as integer minor units (cents/paise), matching the Prisma schema.
export const formatPrice = (minorUnits) => formatter.format(minorUnits / 100);
