import api from "./axios";

export const getWishlist = () => api.get("/wishlist");

export const addToWishlist = (bookId) => api.post("/wishlist", { bookId });

export const removeFromWishlist = (bookId) =>
  api.delete(`/wishlist/${bookId}`);
