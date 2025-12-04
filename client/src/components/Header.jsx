// client/src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Header.css";

/**
 * Simple header with:
 * - BangleHouse logo (text)
 * - Menu: Bangles, Earnings
 * - Right-side: avatar uploader, wishlist, cart
 *
 * Avatar is previewed locally. To upload to backend, call `uploadAvatarToServer(file)` (placeholder).
 */

export default function Header({ cartCount = 0 }) {
  const [menu] = useState([
    { key: "bangles", label: "Bangles", path: "/bangles" },
    { key: "earnings", label: "Earnings", path: "/earnings" },
  ]);

  const [avatarSrc, setAvatarSrc] = useState(null);
  const fileRef = useRef(null);

  // load saved avatar from localStorage (simple persistence)
  useEffect(() => {
    const saved = localStorage.getItem("bh_avatar");
    if (saved) setAvatarSrc(saved);
  }, []);

  function onAvatarClick() {
    fileRef.current?.click();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // preview locally
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSrc(reader.result);
      try {
        localStorage.setItem("bh_avatar", reader.result); // quick persistence
      } catch {}
    };
    reader.readAsDataURL(file);

    // optional: upload to backend (if you later implement an endpoint)
    // uploadAvatarToServer(file);
  }

  // placeholder for server upload; implement server route to receive file
  async function uploadAvatarToServer(file) {
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await fetch("http://localhost:4000/api/upload-avatar", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      console.log("uploaded avatar response:", json);
      // json could contain the stored path which you can set as avatarSrc
      // setAvatarSrc(json.path);
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  }

  return (
    <header className="bh-header small">
      <div className="bh-row">
        <div className="bh-left">
          <a className="bh-logo" href="/">BangleHouse</a>
          <nav className="bh-nav">
            <ul>
              {menu.map((m) => (
                <li key={m.key}>
                  <a href={m.path}>{m.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="bh-right">
          <div className="bh-actions">
            {/* Avatar / Profile */}
            <div className="bh-avatar-wrap" onClick={onAvatarClick} role="button" title="Upload avatar">
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="bh-avatar" />
              ) : (
                <div className="bh-avatar placeholder" aria-hidden> 
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 20a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} />
            </div>

            {/* Wishlist */}
            <a className="bh-icon" href="/wishlist" title="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.8 8.6c0 6.3-8.8 11.6-8.8 11.6S3.2 14.9 3.2 8.6C3.2 6 5 4 7.6 4c1.5 0 3 .9 3.4 2.1.4-1.2 1.9-2.1 3.4-2.1 2.6 0 4.4 2 4.4 4.6z" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </a>

            {/* Cart */}
            <a className="bh-bag" href="/cart" title="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:8}}>
                <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <circle cx="10" cy="20" r="1" fill="currentColor"/>
                <circle cx="18" cy="20" r="1" fill="currentColor"/>
              </svg>
              <span className="bh-badge">{cartCount}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
