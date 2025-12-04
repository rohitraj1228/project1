// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Bangles from "./pages/Bangles";
import "./index.css"; // ensure this is imported so styles below apply

export default function App() {
  const [page, setPage] = useState("home");

  const getCartCount = () =>
    (JSON.parse(localStorage.getItem("cart") || "[]") || []).reduce(
      (s, i) => s + (i.qty || 0),
      0
    );

  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const onStorage = () => setCartCount(getCartCount());
    window.addEventListener("storage", onStorage);
    const t = setInterval(() => setCartCount(getCartCount()), 800);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, []);

  const [avatarSrc, setAvatarSrc] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bh_avatar");
      if (saved) setAvatarSrc(saved);
    } catch (err) {
      // ignore
    }
  }, []);

  function onAvatarClick() {
    fileRef.current?.click();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      setAvatarSrc(data);
      try {
        localStorage.setItem("bh_avatar", data);
      } catch (err) {
        console.warn("Failed to save avatar to localStorage", err);
      }
    };
    reader.readAsDataURL(file);
  }

  // search query state
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* left: logo */}
          <div className="header-left">
            <div className="brand" onClick={() => setPage("home")}>
              <span className="brand-mark">BH</span>
              <span className="brand-text">BangleHouse</span>
            </div>

            {/* nav */}
            <nav className="main-nav" aria-label="Main navigation">
              <ul>
                <li>
                  <button
                    onClick={() => setPage("bangles")}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                  >
                    Bangles
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage("earnings")}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                  >
                    Earnings
                  </button>
                </li>
                {/* add more nav items as needed */}
              </ul>
            </nav>
          </div>

          {/* center: wide search */}
          <div className="header-center">
            <div className="search-wrap">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6">
                <path d="M21 21l-4.35-4.35" />
                <circle cx="10.5" cy="10.5" r="6.5" />
              </svg>
              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* right: icons + labels */}
          <div className="header-right">
            <div className="icon-col" onClick={onAvatarClick} title="Profile">
              <div className="icon-circle">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="avatar-img" />
                ) : (
                  <svg width="22" height="22" fill="none" stroke="#333">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                    <path d="M4 20a8 8 0 0116 0" />
                  </svg>
                )}
              </div>
              <div className="icon-label">Profile</div>
            </div>

            <div className="icon-col" title="Wishlist">
              <div className="icon-circle small">
                <svg width="20" height="20" fill="none" stroke="#333">
                  <path d="M20.8 8.6c0 6.3-8.8 11.6-8.8 11.6S3.2 14.9 3.2 8.6C3.2 6 5 4 7.6 4s3.4.9 3.4 2.1C11.4 4.9 12.9 4 14.4 4c2.6 0 4.4 2 4.4 4.6z" />
                </svg>
              </div>
              <div className="icon-label">Wishlist</div>
            </div>

            <div className="icon-col" title="Cart" onClick={() => setPage("cart")}>
              <div className="icon-circle">
                <svg width="20" height="20" fill="none" stroke="#333">
                  <path d="M6 6h14l-2 9H8L6 6z" />
                  <circle cx="9" cy="18" r="1" />
                  <circle cx="17" cy="18" r="1" />
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <div className="icon-label">Bag</div>
            </div>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </header>

      {/* Pages */}
      {page === "home" && <Home openCart={() => setPage("cart")} searchQuery={searchQuery} />}
      {page === "bangles" && <Bangles openCart={() => setPage("cart")} searchQuery={searchQuery} />}
      {page === "cart" && <Cart goBack={() => setPage("home")} />}
      {page === "earnings" && (
        <main style={{ padding: 32 }}>
          <h2>Earnings</h2>
          <p>This is the seller earnings area (placeholder).</p>
          <button onClick={() => setPage("home")}>Back to shop</button>
        </main>
      )}

      <footer className="site-footer" style={{ padding: 28, textAlign: "center", marginTop: 40 }}>
        © {new Date().getFullYear()} BangleHouse — handcrafted bangles & timeless design.
      </footer>
    </>
  );
}


