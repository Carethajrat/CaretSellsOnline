import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SkipLink from "./SkipLink.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  // Move focus to <main> on route change so keyboard/screen-reader users land on new content.
  useEffect(() => {
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <div className="cs-layout d-flex flex-column min-vh-100">
      <SkipLink />
      <Header cartCount={0} />
      <main id="main-content" className="cs-layout__main container flex-grow-1 py-4" tabIndex={-1} ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
