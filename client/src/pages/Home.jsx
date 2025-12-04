// client/src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";

const API = "http://localhost:4000/api";

export default function Home({ openCart }) {
  const [products, setProducts] = useState([]);
  const [showUI, setShowUI] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    })();
  }, []);

  // Try programmatic play (many browsers allow muted autoplay if play() called)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";

    const tryPlay = async () => {
      try {
        const p = v.play();
        if (p instanceof Promise) {
          await p;
        }
        console.log("[Intro] play() success or already playing");
      } catch (err) {
        console.warn("[Intro] play() blocked:", err);
        // if autoplay is blocked, show UI so user isn't stuck with blank
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

  function onVideoError(e) {
    console.error("[Intro] video error event:", e);
    setShowUI(true);
    setFadeIn(true);
  }

  return (
    <>
      {!showUI && (
        <div className="intro-overlay">
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
        <main className={`product-grid ${fadeIn ? "fade-in" : ""}`}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} openCart={openCart} />
          ))}
        </main>
      )}
    </>
  );
}
