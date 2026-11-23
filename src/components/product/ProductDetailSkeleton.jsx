// Visual placeholder only; the announcement lives in ProductDetailPage.
export default function ProductDetailSkeleton() {
  return (
    <div className="cs-detail-skeleton row g-4 g-lg-5 placeholder-glow" aria-hidden="true">
      <div className="cs-detail-skeleton__media col-12 col-lg-6">
        <div className="ratio ratio-1x1">
          <span className="cs-detail-skeleton__image placeholder"></span>
        </div>
      </div>
      <div className="cs-detail-skeleton__info col-12 col-lg-6">
        <span className="cs-detail-skeleton__line placeholder col-3 d-block mb-3"></span>
        <span className="cs-detail-skeleton__line placeholder col-9 d-block mb-3"></span>
        <span className="cs-detail-skeleton__line placeholder col-4 d-block mb-4"></span>
        <span className="cs-detail-skeleton__line placeholder col-12 d-block mb-2"></span>
        <span className="cs-detail-skeleton__line placeholder col-11 d-block mb-4"></span>
        <span className="cs-detail-skeleton__button placeholder col-12 d-block"></span>
      </div>
    </div>
  );
}
