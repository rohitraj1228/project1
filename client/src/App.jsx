import React, { useState } from "react";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

export default function App() {
  const [page, setPage] = useState("home");
  const cartCount = JSON.parse(localStorage.getItem("cart") || "[]").reduce((s,i)=> s + i.qty, 0);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="brand" onClick={() => setPage("home")}>BangleHouse</div>
          <div className="search" role="search">
            <input placeholder="Search bangles, style, color..." aria-label="Search" />
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn">Sign in</button>
          <button className="icon-btn cart-badge" onClick={() => setPage("cart")}>
            Cart
            <span className="count">{cartCount}</span>
          </button>
        </div>
      </header>

      {page === "home" && <Home openCart={() => setPage("cart")} />}
      {page === "cart" && <Cart goBack={() => setPage("home")} />}

        <footer className="site-footer">
  © {new Date().getFullYear()} BangleHouse — handcrafted bangles & timeless design.
</footer>

    </>
    
  );
}

