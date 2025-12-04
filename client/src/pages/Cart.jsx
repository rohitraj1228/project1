import React, { useEffect, useState } from "react";

const API = "http://localhost:4000/api";

export default function Cart({ goBack }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
  }, []);

  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  async function placeOrder() {
    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total }),
    });

    if (res.ok) {
      alert("Order placed!");
      updateCart([]);
      goBack();
    }
  }

  return (
    <div className="cart-page">
      <button onClick={goBack}>← Back</button>
      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} />
          <div>
            <h4>{item.title}</h4>
            <p>₹{item.price} x {item.qty}</p>
            <button onClick={() => updateCart(cart.filter(i => i.id !== item.id))}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button onClick={placeOrder} disabled={!cart.length}>
        Checkout
      </button>
    </div>
  );
}
