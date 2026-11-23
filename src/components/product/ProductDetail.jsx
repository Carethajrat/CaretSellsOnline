import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice.js";
import ProductGallery from "./ProductGallery.jsx";
import ProductPurchaseForm from "./ProductPurchaseForm.jsx";

function getAvailability(product, selected) {
  const pool = selected ? [selected] : product.variants;
  const left = pool.reduce((sum, v) => sum + v.stock, 0);
  if (left <= 0) return { key: "out-of-stock", label: "Out of stock" };
  if (product.availability === "low-stock") return { key: "low-stock", label: `Low stock: only ${left} left` };
  return { key: "in-stock", label: "In stock" };
}

// Presentational page body. Pass key={product.id} from the parent so
// variant, quantity and gallery state reset when the product changes.
export default function ProductDetail({ product, onAddToCart }) {
  const { name, category, brand, rating, reviewCount, description, images, variants, discountPercentage } = product;

  // A single variant needs no choice, so it is pre-selected.
  const [variantId, setVariantId] = useState(variants.length === 1 ? variants[0].id : null);
  const selected = variants.find((v) => v.id === variantId) ?? null;

  const unitPrice = product.basePrice + (selected ? selected.priceDelta : 0);
  const availability = getAvailability(product, selected);

  const specs = [
    ["SKU", product.sku],
    ["Brand", brand],
    ["Shipping", product.shippingInformation],
    ["Returns", product.returnPolicy],
    ["Warranty", product.warrantyInformation],
  ].filter(([, value]) => value);

  return (
    <article className="cs-product-detail" aria-labelledby="product-title">
      <nav className="cs-product-detail__breadcrumb" aria-label="Breadcrumb">
        <ol className="cs-product-detail__crumbs breadcrumb mb-3">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{name}</li>
        </ol>
      </nav>

      <div className="cs-product-detail__layout row g-4 g-lg-5">
        <div className="cs-product-detail__media col-12 col-lg-6">
          <ProductGallery images={images} name={name} />
        </div>

        <div className="cs-product-detail__info col-12 col-lg-6 d-flex flex-column gap-3">
          <div className="cs-product-detail__header">
            {category && (
              <p className="cs-product-detail__category small text-body-secondary text-capitalize mb-1">{category}</p>
            )}
            <h1 className="cs-product-detail__title h2 mb-2" id="product-title">{name}</h1>
            <p className="cs-product-detail__meta small mb-0">
              {brand && <span className="cs-product-detail__brand me-3">By {brand}</span>}
              {rating !== null && (
                <span className="cs-product-detail__rating">
                  <span aria-hidden="true">★ {rating.toFixed(1)}{reviewCount > 0 ? ` (${reviewCount})` : ""}</span>
                  <span className="visually-hidden">
                    Rated {rating.toFixed(1)} out of 5{reviewCount > 0 ? ` from ${reviewCount} reviews` : ""}
                  </span>
                </span>
              )}
            </p>
          </div>

          <div className="cs-product-detail__buy-box">
            <p className="cs-product-detail__price h3 mb-1" aria-live="polite" aria-atomic="true">
              <span className="visually-hidden">Price: </span>
              {formatPrice(unitPrice)}
              {discountPercentage > 0 && (
                <span className="cs-product-detail__discount badge text-bg-primary fs-6 ms-2">
                  {Math.round(discountPercentage)}% off
                </span>
              )}
            </p>
            <p
              className={`cs-product-detail__stock cs-product-detail__stock--${availability.key} mb-0`}
              aria-live="polite"
              aria-atomic="true"
            >
              {availability.label}
            </p>
          </div>

          {description && <p className="cs-product-detail__description mb-0">{description}</p>}

          <ProductPurchaseForm
            product={product}
            variantId={variantId}
            onVariantChange={setVariantId}
            onAddToCart={onAddToCart}
          />

          {specs.length > 0 && (
            <section className="cs-product-detail__details" aria-labelledby="product-details-title">
              <h2 className="cs-product-detail__details-title h5" id="product-details-title">Product details</h2>
              <dl className="cs-product-detail__specs mb-0">
                {specs.map(([term, value]) => (
                  <div className="cs-product-detail__spec d-flex flex-wrap gap-2 py-2 border-bottom" key={term}>
                    <dt className="cs-product-detail__spec-term fw-semibold">{term}</dt>
                    <dd className="cs-product-detail__spec-value mb-0">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
