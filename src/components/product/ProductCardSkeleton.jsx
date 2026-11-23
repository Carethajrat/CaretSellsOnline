// Visual placeholder only; the announcement lives in TrendingProducts' status region.
export default function ProductCardSkeleton() {
  return (
    <div className="cs-product-skeleton card h-100 placeholder-glow" aria-hidden="true">
      <div className="cs-product-skeleton__media ratio ratio-1x1">
        <span className="cs-product-skeleton__image placeholder"></span>
      </div>
      <div className="cs-product-skeleton__body card-body">
        <span className="cs-product-skeleton__line placeholder col-4 d-block mb-2"></span>
        <span className="cs-product-skeleton__line placeholder col-10 d-block mb-2"></span>
        <span className="cs-product-skeleton__line placeholder col-6 d-block"></span>
      </div>
    </div>
  );
}
