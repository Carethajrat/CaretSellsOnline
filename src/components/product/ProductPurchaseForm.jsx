import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice.js";

function validateQuantity(raw, max) {
  if (raw.trim() === "") return "Enter a quantity.";
  const n = Number(raw);
  if (!Number.isInteger(n)) return "Quantity must be a whole number.";
  if (n < 1) return "Quantity must be at least 1.";
  if (n > max) return `Only ${max} available. Enter ${max} or fewer.`;
  return "";
}

// Variant choice is lifted to the parent (the price depends on it);
// quantity, validation and submit state live here.
// onAddToCart({ variantId, quantity, product }) must return a Promise.
export default function ProductPurchaseForm({ product, variantId, onVariantChange, onAddToCart }) {
  const { variants, name } = product;
  const hasChoice = variants.length > 1;
  const selected = variants.find((v) => v.id === variantId) ?? null;

  const [quantity, setQuantity] = useState("1");
  const [touched, setTouched] = useState(false);
  const [variantError, setVariantError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const qtyRef = useRef(null);
  const firstRadioRef = useRef(null);

  const maxQty = selected ? selected.stock : Math.max(0, ...variants.map((v) => v.stock));
  const qtyError = touched && maxQty > 0 ? validateQuantity(quantity, maxQty) : "";

  let blockedReason = "";
  if (maxQty <= 0) blockedReason = "This item is currently out of stock.";
  else if (!selected) blockedReason = "Choose an option to add this item to your cart.";

  const handleVariantChange = (id) => {
    setVariantError("");
    setMessage("");
    setSubmitError("");
    onVariantChange(id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return; // no double submit
    setMessage("");
    setSubmitError("");

    if (!selected) {
      setVariantError("Choose an option before adding to your cart.");
      firstRadioRef.current?.focus();
      return;
    }

    setTouched(true);
    if (validateQuantity(quantity, maxQty)) {
      qtyRef.current?.focus();
      return;
    }

    const qty = Number(quantity);
    setSubmitting(true);
    try {
      await onAddToCart({ variantId: selected.id, quantity: qty, product });
      setMessage(`Added ${qty} × ${name}${hasChoice ? ` (${selected.label})` : ""} to your cart.`);
    } catch {
      setSubmitError("We couldn't add this to your cart. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="cs-purchase" onSubmit={handleSubmit} noValidate aria-label="Add to cart">
      {hasChoice && (
        <fieldset className="cs-purchase__variants mb-3" aria-describedby={variantError ? "purchase-variant-error" : undefined}>
          <legend className="cs-purchase__legend h6">Choose an option</legend>
          {variants.map((v, i) => {
            const out = v.stock <= 0;
            const inputId = `purchase-variant-${i}`;
            return (
              <div className="cs-purchase__variant form-check" key={v.id}>
                <input
                  className="cs-purchase__variant-input form-check-input"
                  type="radio"
                  name="variant"
                  id={inputId}
                  value={v.id}
                  checked={v.id === variantId}
                  disabled={out}
                  aria-describedby={out ? `${inputId}-note` : undefined}
                  ref={i === 0 ? firstRadioRef : null}
                  onChange={() => handleVariantChange(v.id)}
                />
                <label className="cs-purchase__variant-label form-check-label" htmlFor={inputId}>
                  {v.label}
                  {v.priceDelta !== 0 && (
                    <span className="cs-purchase__variant-price">
                      {" "}({v.priceDelta > 0 ? "+" : "−"}{formatPrice(Math.abs(v.priceDelta))})
                    </span>
                  )}
                </label>
                {out && (
                  <span className="cs-purchase__variant-note small ms-2" id={`${inputId}-note`}>
                    Out of stock
                  </span>
                )}
              </div>
            );
          })}
          {variantError && (
            <p className="cs-purchase__error mt-2 mb-0" id="purchase-variant-error" role="alert">
              <span aria-hidden="true">⚠ </span>{variantError}
            </p>
          )}
        </fieldset>
      )}

      <div className="cs-purchase__qty mb-3">
        <label className="cs-purchase__qty-label form-label" htmlFor="purchase-qty">Quantity</label>
        <input
          className="cs-purchase__qty-input form-control"
          id="purchase-qty"
          type="number"
          inputMode="numeric"
          min={1}
          max={maxQty > 0 ? maxQty : 1}
          step={1}
          value={quantity}
          disabled={maxQty <= 0}
          ref={qtyRef}
          aria-invalid={qtyError ? "true" : "false"}
          aria-describedby={qtyError ? "purchase-qty-error purchase-qty-hint" : "purchase-qty-hint"}
          onChange={(e) => { setQuantity(e.target.value); setTouched(true); setMessage(""); }}
          onBlur={() => setTouched(true)}
        />
        <p className="cs-purchase__qty-hint form-text mb-0" id="purchase-qty-hint">
          {maxQty > 0 ? `${maxQty} available` : "Currently unavailable"}
        </p>
        {qtyError && (
          <p className="cs-purchase__error mt-1 mb-0" id="purchase-qty-error" role="alert">
            <span aria-hidden="true">⚠ </span>{qtyError}
          </p>
        )}
      </div>

      <button
        className="cs-purchase__submit btn btn-primary btn-lg w-100"
        type="submit"
        disabled={Boolean(blockedReason) || submitting}
        aria-describedby={blockedReason ? "purchase-hint" : undefined}
      >
        {submitting ? "Adding…" : "Add to cart"}
      </button>
      {blockedReason && (
        <p className="cs-purchase__hint form-text mt-2 mb-0" id="purchase-hint">{blockedReason}</p>
      )}

      {/* Live regions exist before their content changes so updates are announced. */}
      <div className="cs-purchase__status mt-3" role="status">
        {message && (
          <p className="cs-purchase__success alert alert-success mb-0">
            {message}{" "}
            <Link className="cs-purchase__cart-link alert-link" to="/cart">View cart</Link>
          </p>
        )}
      </div>
      <div className="cs-purchase__alert" role="alert">
        {submitError && <p className="cs-purchase__submit-error alert alert-danger mt-3 mb-0">{submitError}</p>}
      </div>
    </form>
  );
}
