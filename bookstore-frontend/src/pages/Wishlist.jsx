import { useContext } from "react";
import WishlistContext from "../context/WishlistContext";
import { Trash2, Heart, Frown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, loadingWishlist, removeFromWishlist } = useContext(WishlistContext);

  if (loadingWishlist) {
    return null;
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600 mt-10 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <Frown className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Your wishlist is empty.</p>
        <p className="text-sm text-gray-500 mt-2">Start adding books you love to your wishlist!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">

      {/* Wishlist Header */}
      <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-3">
        <Heart className="w-8 h-8 text-pink-500 fill-pink-500" /> Your Wishlist
      </h2>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <Link to={`/books/${item.book._id}`} className="flex items-center gap-4 w-full sm:w-auto cursor-pointer">
              <img
                src={item.book.imageUrl || "/placeholder.jpeg"}
                alt={item.book.title}
                onError={(e) => (e.target.src = "/placeholder.jpeg")}
                className="w-16 h-24 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-blue-700 hover:underline">{item.book.title}</h3>
                <p className="text-sm text-gray-600">by {item.book.author}</p>
                <p className="text-md font-bold text-blue-600 mt-1">
                  ₹{item.book.price}
                </p>
              </div>
            </Link>

            <button
              onClick={() => removeFromWishlist(item.book._id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-full hover:bg-red-100 transition-colors font-medium text-sm shadow-sm"
              title="Remove from Wishlist"
            >
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
