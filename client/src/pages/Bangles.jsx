// client/src/pages/Bangles.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";

const API = "http://localhost:4000/api";

function parseRange(rangeStr) {
  const [a, b] = rangeStr.split("-").map((v) => Number(v));
  return { min: Number.isFinite(a) ? a : 0, max: Number.isFinite(b) ? b : Infinity };
}

export default function Bangles({ openCart, searchQuery = "" }) {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  const SIZES = ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"];
  const PRICE_RANGES = [
    "100-200","200-400","400-600","600-800","800-1000",
    "1000-1200","1200-1400","1400-1600","1600-1800","1800-2000"
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      }
    })();
  }, []);

  function toggleSize(s) {
    setSelectedSizes(prev => {
      const set = new Set(prev);
      if (set.has(s)) set.delete(s); else set.add(s);
      return Array.from(set);
    });
  }
  function togglePriceRange(r) {
    setSelectedPriceRanges(prev => {
      const set = new Set(prev);
      if (set.has(r)) set.delete(r); else set.add(r);
      return Array.from(set);
    });
  }
  function clearFilters() {
    setSelectedSizes([]);
    setSelectedPriceRanges([]);
  }

  const filteredProducts = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    const ranges = selectedPriceRanges.map(parseRange);
    return products.filter((p) => {
      const price = Number(p.price ?? p.priceAmount ?? 0);
      const size = String(p.size ?? p.size_no ?? "").trim();

      if (q) {
        const name = String(p.name ?? p.title ?? "").toLowerCase();
        if (!name.includes(q)) return false;
      }
      if (selectedSizes.length > 0 && !selectedSizes.includes(size)) return false;
      if (ranges.length > 0) {
        const inAny = ranges.some(r => price >= r.min && price <= r.max);
        if (!inAny) return false;
      }
      return true;
    });
  }, [products, searchQuery, selectedSizes, selectedPriceRanges]);

  return (
    <main style={{ display: "flex", gap: 20, padding: "24px", maxWidth: 1350, margin: "0 auto" }}>
      <aside style={{ width: 300, minWidth: 260, background: "#fff", borderRadius: 8, padding: 12, border: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>FILTERS</h3>
          <button onClick={clearFilters} style={{ background: "transparent", border: "none", color: "#e53935", fontWeight: 700, cursor: "pointer" }}>Clear</button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h4 style={{ margin: "8px 0", fontSize: 12, fontWeight: 700 }}>SIZE</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {SIZES.map(s => (
              <li key={s} style={{ padding: "6px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" checked={selectedSizes.includes(s)} onChange={() => toggleSize(s)} />
                  <span>{s}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <hr />

        <div style={{ marginTop: 12 }}>
          <h4 style={{ margin: "8px 0", fontSize: 12, fontWeight: 700 }}>PRICE RANGE</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {PRICE_RANGES.map(r => (
              <li key={r} style={{ padding: "6px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" checked={selectedPriceRanges.includes(r)} onChange={() => togglePriceRange(r)} />
                  <span>{r}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontWeight: 700 }}>{filteredProducts.length} results</div>
          <div><button onClick={clearFilters} style={{ border: "none", background: "transparent", color: "#e53935", cursor: "pointer", fontWeight: 700 }}>Clear filters</button></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} openCart={openCart} />)}
          {filteredProducts.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#666", padding: 40 }}>No products found.</div>}
        </div>
      </section>
    </main>
  );
}

