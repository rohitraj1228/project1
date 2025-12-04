import React from "react";

export default function ProductCard({ product, openCart }) {
  const src = product.image ? `http://localhost:4000/${product.image}` : '';
  const placeholder = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#f3f3f3'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#bbb' font-size='18'>No Image</text></svg>`);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) cart[idx].qty += 1;
    else cart.unshift({ id: product.id, title: product.title, price: product.price, qty: 1, image: src || placeholder });
    localStorage.setItem('cart', JSON.stringify(cart));
    openCart && openCart();
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <article className="product-card" aria-labelledby={`p-${product.id}`}>
      <div className="badge">New</div>
      <img className="prod-img" src={src || placeholder} alt={product.title} onError={(e)=> e.currentTarget.src = placeholder} />
      <h3 id={`p-${product.id}`}>{product.title}</h3>
      <p className="desc">{product.description}</p>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
        <div className="price">
          <span className="gold">₹{product.price}</span>
        </div>
        <div className="actions">
          <button onClick={addToCart}>Add</button>
        </div>
      </div>
    </article>
  );
}

