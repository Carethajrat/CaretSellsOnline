import TrendingProducts from "../components/home/TrendingProducts.jsx";

export default function HomePage() {
  return (
    <>
      <section className="cs-hero py-5" aria-labelledby="hero-title">
        <h1 id="hero-title" className="cs-hero__title display-5 fw-bold">
          Find what you need, delivered to your door
        </h1>
        <p className="cs-hero__text lead">Browse trending products across every category.</p>
      </section>
      <TrendingProducts />
    </>
  );
}
