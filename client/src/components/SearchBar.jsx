// src/components/SearchBar.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";

/**
 * Simple SearchBar component:
 * - props.items: array of strings OR objects like { id, name }
 * - props.onResults: function(filteredArray) called when list changes
 * - props.placeholder: optional text
 * - props.textKey: if items are objects, use item[textKey] (default "name")
 * - props.debounceMs: optional delay before calling onResults
 */
export default function SearchBar({
  items = [],
  onResults = null,
  placeholder = "Search...",
  textKey = "name",
  debounceMs = 0,
}) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);

  const getText = (item) => {
    if (typeof item === "string") return item;
    if (!item) return "";
    return String(item[textKey] ?? item.name ?? item.title ?? "");
  };

  const filteredSync = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => getText(it).toLowerCase().includes(q));
  }, [items, query, textKey]);

  useEffect(() => {
    if (typeof onResults !== "function") return;
    if (!debounceMs) {
      onResults(filteredSync);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onResults(filteredSync);
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filteredSync, onResults, debounceMs]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
