import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="cs-not-found py-5" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="cs-not-found__title h2">Page not found</h1>
      <p className="cs-not-found__text">We couldn't find that page.</p>
      <Link className="cs-not-found__link btn btn-primary" to="/">Back to home</Link>
    </section>
  );
}
