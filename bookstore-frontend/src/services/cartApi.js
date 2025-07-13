import api from "./axios";

export const fetchCart = () => api.get("/cart");

export const saveCart = (items) => api.post("/cart", { items });

export const clearCart = () => api.delete("/cart");
