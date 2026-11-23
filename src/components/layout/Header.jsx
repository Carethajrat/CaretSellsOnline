import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const CATEGORIES = [
  { to: "/search?category=home", label: "Home & living" },
  { to: "/search?category=electronics", label: "Electronics" },
  { to: "/search?category=fashion", label: "Fashion" },
  { to: "/search?category=sports", label: "Sports & outdoors" },
];

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="cs-header border-bottom bg-white">
      <div className="container py-2">
        <div className="cs-header__bar d-flex flex-wrap align-items-center gap-2 gap-md-3">
          <Link className="cs-header__brand navbar-brand fw-bold me-md-3" to="/">
            Caretsellsonline
          </Link>

          <form
            className="cs-header__search order-3 order-md-2 flex-grow-1"
            role="search"
            aria-label="Site search"
            onSubmit={handleSearch}
          >
            <div className="input-group">
              <label className="cs-header__search-label visually-hidden" htmlFor="site-search">
                Search products
              </label>
              <input
                id="site-search"
                className="cs-header__search-input form-control"
                type="search"
                name="q"
                placeholder="Search products"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="cs-header__search-btn btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </form>

          <Link className="cs-header__cart btn btn-outline-primary order-2 order-md-3 ms-auto ms-md-0" to="/cart">
            <span>Cart</span>
            <span className="cs-header__cart-count badge text-bg-primary ms-2" aria-live="polite" aria-atomic="true">
              {cartCount}
              <span className="visually-hidden"> {cartCount === 1 ? "item" : "items"} in cart</span>
            </span>
          </Link>

          <button
            className="cs-header__menu-toggle btn btn-outline-secondary d-md-none order-1"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
      </div>

      <nav
        id="primary-nav"
        className={`cs-primary-nav border-top ${menuOpen ? "d-block" : "d-none"} d-md-block`}
        aria-label="Primary"
      >
        <ul className="cs-primary-nav__list container list-unstyled d-flex flex-column flex-md-row gap-md-4 mb-0 py-2">
          {CATEGORIES.map((c) => (
            <li className="cs-primary-nav__item" key={c.to}>
              <NavLink className="cs-primary-nav__link d-inline-block py-2" to={c.to}>
                {c.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
