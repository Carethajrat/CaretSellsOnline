import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice.js";

const AVAILABILITY_LABEL = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "out-of-stock": "Out of stock",
};

// One focusable link per card (stretched link on the title). The image is
// decorative (alt="") because the product name is the adjacent link text.
// Stock is always text, never colour alone.
export default function ProductCard({ product, headingId }) {
  const { slug, name, imageUrl, basePrice, discountPercentage, rating, availability, category } = product;

  return (
    <article className="cs-product-card card h-100" aria-labelledby={headingId}>
      <div className="cs-product-card__media ratio ratio-1x1 bg-light">
        {imageUrl ? (
          <img
            className="cs-product-card__image object-fit-contain"
            src={imageUrl}
            alt=""
            width="300"
            height="300"
            loading="lazy"
          />
        ) : (
          <span className="cs-product-card__placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="cs-product-card__body card-body d-flex flex-column gap-1">
        {category && (
          <p className="cs-product-card__category small text-body-secondary text-capitalize mb-0">{category}</p>
        )}

        <h3 className="cs-product-card__title h6 mb-0" id={headingId}>
          <Link className="cs-product-card__link stretched-link" to={`/products/${slug}`}>
            {name}
          </Link>
        </h3>

        {rating !== null && (
          <p className="cs-product-card__rating small mb-0">
            <span aria-hidden="true">★ {rating.toFixed(1)}</span>
            <span className="visually-hidden">Rated {rating.toFixed(1)} out of 5</span>
          </p>
        )}

        <p className="cs-product-card__price fw-semibold mb-0">
          <span className="visually-hidden">Price: </span>
          {formatPrice(basePrice)}
          {discountPercentage > 0 && (
            <span className="cs-product-card__discount badge text-bg-primary ms-2">
              {Math.round(discountPercentage)}% off
            </span>
          )}
        </p>

        <p className={`cs-product-card__stock cs-product-card__stock--${availability} small mb-0`}>
          {AVAILABILITY_LABEL[availability]}
        </p>
      </div>
    </article>
  );
}
