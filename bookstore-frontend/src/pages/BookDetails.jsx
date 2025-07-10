import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import CartContext from "../context/CartContext";
import { BadgeCheck, BookOpen, Book, Loader, Minus, Plus } from "lucide-react";
import AuthContext from "../context/AuthContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumb";
import { Rating } from "react-simple-star-rating";


export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleQuantity = (type) => {
    setQuantity((prev) => {
      if (type === "inc" && prev < book.stock) return prev + 1;
      if (type === "dec" && prev > 1) return prev - 1;
      return prev;
    });
  };


  const handleAddToCart = () => {
    addToCart({ ...book, quantity });
    toast.success("Added to cart");
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 300);
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading book...</span>
      </div>
    );
  }

  const shortDesc = book.description?.slice(0, 150) || "";

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb current={"Book Info"} icon={<Book className="w-6 h-6" />} />

      {/* Book Cover */}
      <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8 animate-zoom-in">
        <div className="md:w-1/2">
          <img
            src={book.imageUrl}
            alt={book.title}
            onError={(e) => (e.target.src = "/placeholder.jpeg")}
            className="w-full h-auto max-h-[500px] object-contain rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Book Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-2xl font-bold">{book.title}</span>
            </div>



            {/* Static Rating */}
            <div className="flex items-center gap-1 mt-1 text-sm text-yellow-600">
              <span>★</span>
              <span>4.5</span>
              <span className="text-gray-500 ml-1">(52 reviews)</span>
            </div>


            <p className="text-gray-700 text-sm mt-3 mb-1">
              <span className="font-medium">Author:</span> {book.author}
            </p>

            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Genre:</span>{" "}
              <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                {book.genre}
              </span>
            </p>

            <p className="text-2xl font-bold text-blue-800 mt-2 mb-1">
              ₹{book.price}
            </p>

            <p className="text-sm text-gray-500">
              {book.stock > 0 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  In stock ({book.stock})
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </p>

            {/* Description */}
            {book.description && (
              <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                {showFullDesc ? book.description : shortDesc + "..."}
                {book.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-blue-600 text-xs ml-2 underline"
                  >
                    {showFullDesc ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => handleQuantity("dec")}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold disabled:opacity-40"
            >
              <Minus size={16} />
            </button>

            <span className="text-sm font-medium w-6 text-center">{quantity}</span>

            <button
              onClick={() => handleQuantity("inc")}
              disabled={quantity >= book.stock}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap mt-4">
            {/* Add to Cart */}
            <Tippy
              content={!user ? "Login to add to cart" : book.stock < 1 ? "Out of stock" : ""}
              disabled={user && book.stock > 0}
              animation="scale"
              theme="light-border"
              placement="top"
            >
              <button
                onClick={() => user && handleAddToCart()}
                disabled={book.stock < 1 || !user}
                className={`px-5 py-2 rounded-full font-semibold transition transform duration-300 ${!user || book.stock < 1
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : `bg-blue-600 text-white hover:bg-blue-700 ${animateCart ? "scale-110" : ""}`
                  }`}
              >
                Add to Cart
              </button>
            </Tippy>

            {/* Buy Now */}
            <Tippy
              content={!user ? "Login to buy now" : book.stock < 1 ? "Out of stock" : ""}
              disabled={user && book.stock > 0}
              animation="scale"
              theme="light-border"
              placement="top"
            >
              <button
                onClick={() => user && navigate("/checkout", { state: { book, quantity } })}
                disabled={book.stock < 1 || !user}
                className={`px-5 py-2 rounded-full font-semibold transition ${!user || book.stock < 1
                  ? "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed"
                  : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
              >
                Buy Now
              </button>
            </Tippy>
          </div>
        </div>
      </div>
    </>
  );
}
