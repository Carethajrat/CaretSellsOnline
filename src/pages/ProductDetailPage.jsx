import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct.js";
import ProductDetail from "../components/product/ProductDetail.jsx";
import ProductDetailSkeleton from "../components/product/ProductDetailSkeleton.jsx";

// Placeholder until the cart step replaces it with the real cart action.
// It must return a Promise; reject to show the "couldn't add" message.
const addToCart = async () => {};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { status, product, retry } = useProduct(slug);

  useEffect(() => {
    if (status === "ready") document.title = `${product.name} | Caretsellsonline`;
    else if (status === "not-found") document.title = "Product not found | Caretsellsonline";
    return () => { document.title = "Caretsellsonline"; };
  }, [status, product]);

  const handleRetry = () => {
    retry();
    // The retry button unmounts, so park focus on <main>.
    document.getElementById("main-content")?.focus();
  };

  if (status === "loading") {
    return (
      <section className="cs-product-page cs-product-page--loading" aria-busy="true">
        <h1 className="visually-hidden">Loading product</h1>
        <p className="cs-product-page__status visually-hidden" role="status">Loading product</p>
        <ProductDetailSkeleton />
      </section>
    );
  }

  if (status === "not-found") {
    return (
      <section className="cs-product-page cs-product-page--not-found py-5" aria-labelledby="product-not-found-title">
        <h1 className="cs-product-page__title h2" id="product-not-found-title">Product not found</h1>
        <p className="cs-product-page__text">We couldn't find that product. It may have been removed.</p>
        <Link className="cs-product-page__link btn btn-primary" to="/">Back to home</Link>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="cs-product-page cs-product-page--error py-5" aria-labelledby="product-error-title">
        <h1 className="cs-product-page__title h2" id="product-error-title">We couldn't load this product</h1>
        <div
          className="cs-product-page__error alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3"
          role="alert"
        >
          <p className="cs-product-page__error-text mb-0">Check your connection and try again.</p>
          <button className="cs-product-page__retry btn btn-outline-primary" type="button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  return <ProductDetail key={product.id} product={product} onAddToCart={addToCart} />;
}
