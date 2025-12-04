// App.jsx
import React, { useState, useRef, useEffect } from "react";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

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

  return (
    <>
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "10px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1350px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <div
              onClick={() => setPage("home")}
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "24px",
                fontWeight: "700",
                color: "#0b1b2b",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              BangleHouse
            </div>

            <nav>
              <ul
                style={{
                  display: "flex",
                  listStyle: "none",
                  gap: "25px",
                  margin: 0,
                  padding: 0,
                  fontWeight: 600,
                  color: "#14213d",
                }}
              >
                <li>
                  <button
                    onClick={() => setPage("home")}
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
              </ul>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              onClick={onAvatarClick}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#fff",
                border: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <svg width="22" height="22" fill="none" stroke="#555">
                  <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                  <path d="M4 20a8 8 0 0116 0" />
                </svg>
              )}
            </div>

            <div style={{ cursor: "pointer" }}>
              <svg width="22" height="22" fill="none" stroke="#333">
                <path d="M20.8 8.6c0 6.3-8.8 11.6-8.8 11.6S3.2 14.9 3.2 8.6C3.2 6 5 4 7.6 4s3.4.9 3.4 2.1C11.4 4.9 12.9 4 14.4 4c2.6 0 4.4 2 4.4 4.6z" />
              </svg>
            </div>

            <button
              onClick={() => setPage("cart")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #eee",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" fill="none" stroke="#333">
                <path d="M6 6h14l-2 9H8L6 6z" />
                <circle cx="9" cy="18" r="1" />
                <circle cx="17" cy="18" r="1" />
              </svg>
              Cart
              <span
                style={{
                  background: "#ff5252",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 7px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {cartCount}
              </span>
            </button>
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

      {page === "home" && <Home openCart={() => setPage("cart")} />}
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