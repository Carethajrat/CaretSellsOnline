import { useRef } from "react";
import { useTrendingProducts } from "../../hooks/useTrendingProducts.js";
import { TRENDING } from "../../config/feed.js";
import ProductCard from "../product/ProductCard.jsx";
import ProductCardSkeleton from "../product/ProductCardSkeleton.jsx";

const SKELETON_COUNT = 4;
const GRID_CLASSES = "cs-trending__grid list-unstyled row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mb-0";

// All four async states are handled on purpose: loading | ready | empty | error.
export default function TrendingProducts({ limit = TRENDING.limit }) {
  const { status, products, retry } = useTrendingProducts(limit);
  const titleRef = useRef(null);

  const handleRetry = () => {
    retry();
    // The retry button unmounts, so park focus on the section heading.
    titleRef.current?.focus();
  };

  const announcement = {
    loading: "Loading trending products",
    ready: `Showing ${products.length} trending products`,
    empty: "No trending products right now",
    error: "",
  }[status];

  return (
    <section className="cs-trending" aria-labelledby="trending-title" aria-busy={status === "loading"}>
      <h2 id="trending-title" className="cs-trending__title h3 mb-3" tabIndex={-1} ref={titleRef}>
        Trending
      </h2>

      <p className="cs-trending__status visually-hidden" role="status">{announcement}</p>

      {status === "loading" && (
        <ul className={GRID_CLASSES} aria-hidden="true">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <li className="cs-trending__item col" key={i}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      )}

      {status === "ready" && (
        <ul className={GRID_CLASSES}>
          {products.map((product) => (
            <li className="cs-trending__item col" key={product.id}>
              <ProductCard product={product} headingId={`trending-product-${product.id}`} />
            </li>
          ))}
        </ul>
      )}

      {status === "empty" && (
        <p className="cs-trending__empty py-4 mb-0">
          There are no trending products right now. Please check back soon.
        </p>
      )}

      {status === "error" && (
        <div
          className="cs-trending__error alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3"
          role="alert"
        >
          <p className="cs-trending__error-text mb-0">
            We couldn't load trending products. Check your connection and try again.
          </p>
          <button className="cs-trending__retry btn btn-outline-primary" type="button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
