import api from "./axios";

// 📥 Fetch user's cart
export const fetchCart = () => api.get("/cart");

// 💾 Save or update cart
export const saveCart = (items) => api.post("/cart", { items });

// 🧹 Clear the cart
export const clearCart = () => api.delete("/cart");
