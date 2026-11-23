// Product data access. Components never build feed URLs themselves.

import { feedClient, ApiError } from "./apiClient.js";
import { mapFeedProduct, mapFeedProductDetail } from "./productMapper.js";
import { CARD_FIELDS, TRENDING } from "../config/feed.js";

export async function getTrendingProducts({ limit = TRENDING.limit } = {}) {
  const params = new URLSearchParams({
    sortBy: TRENDING.sortBy,
    order: TRENDING.order,
    limit: String(limit),
    select: CARD_FIELDS.join(","),
  });

  const data = await feedClient.get(`/products?${params}`);

  if (!Array.isArray(data?.products)) {
    throw new ApiError(200, "BAD_PAYLOAD", "The product feed sent an unexpected response.");
  }

  return data.products
    .map(mapFeedProduct)
    .filter(Boolean)
    // Enforce sort + limit here too, in case the feed ignores sortBy/limit.
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

// Unknown or malformed ids resolve to a 404 ApiError so the UI can show
// "Product not found" instead of an endless loader.
export async function getProductBySlug(slug) {
  if (!/^\d+$/.test(String(slug))) {
    throw new ApiError(404, "NOT_FOUND", "Product not found.");
  }

  const data = await feedClient.get(`/products/${slug}`);

  const product = mapFeedProductDetail(data);
  if (!product) {
    throw new ApiError(200, "BAD_PAYLOAD", "The product feed sent an unexpected response.");
  }
  return product;
}
