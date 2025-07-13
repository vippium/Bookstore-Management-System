import api from "./axios";

export const rateBook = (bookId, stars, review) =>
  api.post(`/ratings/${bookId}`, { stars, review });

export const fetchBookRatings = (bookId) => api.get(`/ratings/book/${bookId}`);

export const fetchMyRatings = () => api.get("/ratings/mine");

export const deleteRating = (ratingId) => api.delete(`/ratings/${ratingId}`);