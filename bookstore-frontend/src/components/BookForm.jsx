import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

export default function BookForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    stock: "",
    ISBN: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-300 rounded-3xl shadow-2xl p-8 space-y-4 max-w-xl mx-auto"
    >
      <div className="grid gap-4">

        {/* Optional: Image Preview */}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            onError={(e) => (e.target.src = "/placeholder.jpeg")}
            alt="Book Preview"
            className="w-24 h-32 object-cover rounded shadow mx-auto"
          />
        )}

        {[{ label: "Title", name: "title" },
          { label: "Author", name: "author" },
          { label: "Genre", name: "genre" },
          { label: "ISBN", name: "ISBN" },
          { label: "Image URL", name: "imageUrl" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={form[name]}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full p-2 border rounded-2xl focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-sm"
            />
          </div>
        ))}

        {/* Price + Stock side by side */}
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-600 mb-1 text-center">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full p-2 border rounded-2xl focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-sm"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-600 mb-1 text-center">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full p-2 border rounded-2xl focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            autoComplete="off"
            required
            className="w-full p-2 border rounded-2xl focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-sm resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className={`px-7 py-2 rounded-full font-semibold text-white transition ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? <Loader className="w-4 h-4 animate-spin inline" /> : "Save Book"}
        </button>
      </div>
    </form>
  );
}
