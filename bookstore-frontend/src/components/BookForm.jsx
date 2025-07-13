import { useState, useEffect } from "react";
import { Loader, BookOpen, User, Tag, DollarSign, Package, Barcode, Image, AlignLeft, XCircle } from "lucide-react";
import toast from "react-hot-toast";

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (!form.genre.trim()) newErrors.genre = "Genre is required";
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "Valid price is required";
    if (!form.stock || parseInt(form.stock) < 0) newErrors.stock = "Valid stock is required";
    if (!form.ISBN.trim()) newErrors.ISBN = "ISBN is required";
    if (!form.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    } else {
      toast.error("Please fill in all required fields correctly.", { icon: <XCircle size={20} className="text-red-500" /> });
    }
  };

  const inputFields = [
    { label: "Title", name: "title", type: "text", icon: BookOpen },
    { label: "Author", name: "author", type: "text", icon: User },
    { label: "Genre", name: "genre", type: "text", icon: Tag },
    { label: "ISBN", name: "ISBN", type: "text", icon: Barcode },
    { label: "Image URL", name: "imageUrl", type: "url", icon: Image },
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-xl shadow-lg p-7 space-y-5 max-w-xl mx-auto"
      >
        {form.imageUrl && (
          <div className="mb-5 flex justify-center">
            <img
              src={form.imageUrl}
              onError={(e) => (e.target.src = "/placeholder.jpeg")}
              alt="Book Preview"
              className="w-32 h-40 object-cover rounded-lg shadow-md border border-gray-200"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {inputFields.map(({ label, name, type, icon: Icon }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  className={`w-full px-4 py-2.5 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                    ${errors[name]
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-400 hover:border-blue-300"
                    }`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
            </div>
          ))}

          {/* Price + Stock*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2.5 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                    ${errors.price
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-400 hover:border-blue-300"
                    }`}
                  placeholder="e.g., 299.99"
                />
                <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <div className="relative">
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  min="0"
                  className={`w-full px-4 py-2.5 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                    ${errors.stock
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-400 hover:border-blue-300"
                    }`}
                  placeholder="e.g., 100"
                />
                <Package className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                autoComplete="off"
                required
                className={`w-full p-2.5 pl-10 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 transition text-base resize-none
                  ${errors.description
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-400 hover:border-blue-300"
                  }`}
                placeholder="Provide a detailed description of the book..."
              />
              <AlignLeft className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-2.5 rounded-full font-semibold text-white transition shadow-md flex items-center justify-center gap-2
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"}`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Saving...
              </>
            ) : (
              "Save Book"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
