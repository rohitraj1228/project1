// client/src/pages/Home.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import ProductCard from "../components/ProductCard";

const API = "http://localhost:4000/api";

export default function Home({ openCart, searchQuery = "" }) {
  const [products, setProducts] = useState([]);
  const [showUI, setShowUI] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      } finally {
        // keep intro behavior as before (do not force UI)
      }
    })();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";

    const tryPlay = async () => {
      try {
        const p = v.play();
        if (p instanceof Promise) await p;
      } catch (err) {
        setShowUI(true);
        setFadeIn(true);
      }
    };

    const t = setTimeout(tryPlay, 50);
    return () => clearTimeout(t);
  }, []);

  function onVideoEnded() {
    setShowUI(true);
    setTimeout(() => setFadeIn(true), 50);
  }
  function onVideoError() {
    setShowUI(true);
    setFadeIn(true);
  }

  const filtered = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = String(p.name ?? p.title ?? "").toLowerCase();
      return name.includes(q);
    });
  }, [products, searchQuery]);

  return (
    <>
      {!showUI && (
        <div className="intro-overlay" style={{ width: "100%", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video
            ref={videoRef}
            src="/logo_intro.mp4"
            muted
            playsInline
            onEnded={onVideoEnded}
            onError={onVideoError}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            aria-hidden="true"
          />
        </div>
      )}

      {showUI && (
        <main className={`product-grid ${fadeIn ? "fade-in" : ""}`} style={{ padding: 20, maxWidth: 1350, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Featured Bangles</h2>
            <div style={{ fontWeight: 700 }}>{filtered.length} results</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} openCart={openCart} />
            ))}

            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#666", padding: 40 }}>
                No products found. Try a different search.
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}
