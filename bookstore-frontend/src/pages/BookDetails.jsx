import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import CartContext from "../context/CartContext";
import { BadgeCheck, BookOpen, Loader } from "lucide-react";

export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading book...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Book Cover */}
      <div className="md:w-1/2">
        <img
          src={book.imageUrl}
          alt={book.title}
          onError={(e) => (e.target.src = "/placeholder.jpeg")}
          className="w-full h-auto max-h-[500px] object-contain rounded shadow"
        />
      </div>

      {/* Book Details */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-lg">{book.title}</span>
          </div>

          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Author:</span> {book.author}
          </p>
          <p className="text-gray-700 text-sm mb-3">
            <span className="font-medium">Genre:</span>{" "}
            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
              {book.genre}
            </span>
          </p>

          <p className="text-2xl font-bold text-blue-800 mt-4">₹{book.price}</p>
          <p className="text-sm text-gray-500 mt-1">
            {book.stock > 0 ? (
              <span className="text-green-600 flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" /> In stock ({book.stock})
              </span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4 flex-wrap">
          <button
            onClick={() => addToCart(book)}
            disabled={book.stock < 1}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate("/checkout", { state: { book } })}
            disabled={book.stock < 1}
            className="px-5 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
