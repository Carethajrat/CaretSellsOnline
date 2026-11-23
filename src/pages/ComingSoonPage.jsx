import { Link } from "react-router-dom";

// Shown for pages that are linked from the header/footer but not built yet.
export default function ComingSoonPage({ title }) {
  return (
    <section className="cs-coming-soon py-5" aria-labelledby="coming-soon-title">
      <h1 id="coming-soon-title" className="cs-coming-soon__title h2">{title}</h1>
      <p className="cs-coming-soon__text">This page is built in a later step.</p>
      <Link className="cs-coming-soon__link btn btn-primary" to="/">Back to home</Link>
    </section>
  );
}
