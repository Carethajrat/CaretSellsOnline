// Product feed configuration. DummyJSON is a placeholder source until our own
// Express /api/products routes exist; only this file and productService.js change then.

export const FEED_BASE_URL = "https://dummyjson.com";

// DummyJSON prices are USD. Switch to INR when real catalogue data arrives.
export const CURRENCY = { code: "USD", locale: "en-US" };

// "Trending" has no DummyJSON endpoint, so we define it as top-rated.
export const TRENDING = { limit: 8, sortBy: "rating", order: "desc" };

// Only request the fields a product card needs.
export const CARD_FIELDS = [
  "id",
  "title",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "availabilityStatus",
  "category",
  "thumbnail",
];
