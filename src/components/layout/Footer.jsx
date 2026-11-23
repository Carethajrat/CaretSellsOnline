import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="cs-footer border-top bg-light mt-5">
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between gap-3">
        <p className="cs-footer__copy mb-0">&copy; {new Date().getFullYear()} Caretsellsonline</p>
        <nav className="cs-footer__nav" aria-label="Footer">
          <ul className="cs-footer__list list-unstyled d-flex flex-wrap gap-3 mb-0">
            <li className="cs-footer__item"><Link className="cs-footer__link d-inline-block py-2" to="/orders">Orders</Link></li>
            <li className="cs-footer__item"><Link className="cs-footer__link d-inline-block py-2" to="/cart">Cart</Link></li>
            <li className="cs-footer__item"><Link className="cs-footer__link d-inline-block py-2" to="/account">Account</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
