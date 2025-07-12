import api from "./axios";

// ➕ Add or Update Rating
export const rateBook = (bookId, stars, review) =>
  api.post(`/ratings/${bookId}`, { stars, review });

// 📖 Get All Ratings for a Book
export const fetchBookRatings = (bookId) =>
  api.get(`/ratings/book/${bookId}`);

// 👤 Get Logged-in User's Ratings
export const fetchMyRatings = () => api.get("/ratings/mine");

// ❌ Delete a Rating
export const deleteRating = (ratingId) =>
  api.delete(`/ratings/${ratingId}`);
