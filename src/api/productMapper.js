// Turns a raw DummyJSON product into OUR product shape (mirrors the Prisma
// Product model). Returns null for unusable payloads (Checkpoint rule 3:
// a 200 response does not mean the data is valid).

const AVAILABILITY = {
  "In Stock": "in-stock",
  "Low Stock": "low-stock",
  "Out of Stock": "out-of-stock",
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const text = (v) => (typeof v === "string" ? v.trim() : "");

export function mapFeedProduct(raw) {
  if (!raw || typeof raw !== "object") return null;

  const { id, title, price, thumbnail, category, rating, discountPercentage, stock, availabilityStatus } = raw;

  if (!Number.isFinite(id)) return null;
  if (typeof title !== "string" || !title.trim()) return null;
  if (!Number.isFinite(price) || price < 0) return null;

  let availability = AVAILABILITY[availabilityStatus];
  if (!availability) availability = Number.isFinite(stock) && stock <= 0 ? "out-of-stock" : "in-stock";

  return {
    id: String(id),
    slug: String(id), // DummyJSON detail URLs use the numeric id; our API will use real slugs
    name: title.trim(),
    imageUrl: typeof thumbnail === "string" ? thumbnail : "",
    basePrice: Math.round(price * 100), // minor units
    discountPercentage: Number.isFinite(discountPercentage) ? clamp(discountPercentage, 0, 100) : 0,
    rating: Number.isFinite(rating) ? clamp(rating, 0, 5) : null,
    category: typeof category === "string" ? category.replace(/-/g, " ") : "",
    availability,
  };
}

// Detail view = card fields + gallery, copy, specs and variants.
// DummyJSON has no variants, so each product gets ONE default variant carrying
// its stock. Our own API will return real variants (e.g. pack sizes) in the same shape.
export function mapFeedProductDetail(raw) {
  const base = mapFeedProduct(raw);
  if (!base) return null;

  const images = Array.isArray(raw.images) ? raw.images.filter((s) => typeof s === "string" && s) : [];
  if (images.length === 0 && base.imageUrl) images.push(base.imageUrl);

  const stock =
    base.availability === "out-of-stock" ? 0 : Number.isFinite(raw.stock) ? Math.max(0, Math.floor(raw.stock)) : 0;

  return {
    ...base,
    description: text(raw.description),
    brand: text(raw.brand),
    sku: text(raw.sku),
    images,
    reviewCount: Array.isArray(raw.reviews) ? raw.reviews.length : 0,
    shippingInformation: text(raw.shippingInformation),
    returnPolicy: text(raw.returnPolicy),
    warrantyInformation: text(raw.warrantyInformation),
    variants: [
      {
        id: text(raw.sku) || `${base.id}-default`,
        label: "Standard",
        priceDelta: 0, // minor units
        stock,
      },
    ],
  };
}
