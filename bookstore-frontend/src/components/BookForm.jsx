
// 🚧 WIP : BookForm component is still under development. It'll be updated once completed.

import { useState } from "react";

export default function BookForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    author: initialData.author || "",
    genre: initialData.genre || "",
    price: initialData.price || "",
    stock: initialData.stock || "",
    ISBN: initialData.ISBN || "",
    imageUrl: initialData.imageUrl || "",
    description: initialData.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-3xl shadow-md border border-gray-100
                 transition-all hover:scale-[1.015] hover:shadow-2xl hover:ring-1 hover:ring-gray-200"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* ISBN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
        <input
          name="ISBN"
          value={form.ISBN}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-2xl text-sm resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-80 bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
