import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../services/axios";
import CartContext from "../context/CartContext";
import AuthContext from "../context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => setBook(null));
  }, [id]);

  if (!book) return <div className="p-6">❌ Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.imageUrl}
          alt={book.title}
          onError={(e) => (e.target.src = "/placeholder.jpeg")}
          className="w-full md:w-1/3 h-80 object-cover rounded-3xl shadow-md"
        />

        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold text-blue-700">{book.title}</h1>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500">Genre: {book.genre}</p>
          <p className="text-xl text-blue-800 font-bold">₹{book.price}</p>

          <p className="text-gray-700">{book.description}</p>

          {isLoggedIn && (
            <div className="space-x-3 mt-4">
              <button
                onClick={() => addToCart(book)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Add to Cart
              </button>

              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
