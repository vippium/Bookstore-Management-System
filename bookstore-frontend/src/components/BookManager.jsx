import { useEffect, useState } from "react";
import api from "../services/axios";
import {
  Pencil,
  Trash2,
  Loader,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

export default function BookManager() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("default"); // "title" | "genre" | "stock" | "price"
  const [sortOrder, setSortOrder] = useState("default"); // "asc" | "desc" | "default"

  useEffect(() => {
    api
      .get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const cycleSort = (field) => {
    if (sortBy !== field) {
      setSortBy(field);
      setSortOrder("asc");
    } else {
      setSortOrder((prev) =>
        prev === "default" ? "asc" : prev === "asc" ? "desc" : "default"
      );
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field || sortOrder === "default")
      return <ChevronsUpDown className="w-4 h-4 inline-block text-gray-300" />;
    if (sortOrder === "asc")
      return <ChevronUp className="w-4 h-4 inline-block text-blue-600" />;
    return <ChevronDown className="w-4 h-4 inline-block text-blue-600" />;
  };

  const sortedBooks = () => {
    if (sortOrder === "default") return books;

    const sorted = [...books];
    sorted.sort((a, b) => {
      const aVal =
        sortBy === "stock"
          ? a.stock
          : sortBy === "price"
            ? a.price
            : a[sortBy].toString().toLowerCase();
      const bVal =
        sortBy === "stock"
          ? b.stock
          : sortBy === "price"
            ? b.price
            : b[sortBy].toString().toLowerCase();

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const displayedBooks = sortedBooks();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-blue-600">
        <Loader className="animate-spin w-5 h-5 mr-2" />
        Loading books...
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-sm">
        No books found in the system.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-200 rounded-3xl overflow-hidden">
        <thead className="bg-blue-50 text-blue-700 text-xs uppercase">
          <tr>
            <th className="p-3">Cover</th>

            {/* Title */}
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => cycleSort("title")}
            >
              <div className="flex items-center gap-1">
                Title {renderSortIcon("title")}
              </div>
            </th>

            <th className="p-3">Author</th>

            {/* Genre */}
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => cycleSort("genre")}
            >
              <div className="flex items-center gap-1">
                Genre {renderSortIcon("genre")}
              </div>
            </th>

            {/* Stock */}
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => cycleSort("stock")}
            >
              <div className="flex items-center gap-1">
                Stock {renderSortIcon("stock")}
              </div>
            </th>

            {/* Price */}
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => cycleSort("price")}
            >
              <div className="flex items-center gap-1">
                Price {renderSortIcon("price")}
              </div>
            </th>

            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {displayedBooks.map((book) => (
            <tr
              key={book._id}
              className="border-t border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="p-3">
                <img
                  src={book.imageUrl || "/placeholder.jpeg"}
                  onError={(e) => (e.target.src = "/placeholder.jpeg")}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded shadow"
                />
              </td>

              {/* 2-line title support */}
              <td className="p-3 font-medium text-gray-800 max-w-[160px]">
                <div className="line-clamp-2 break-words leading-snug">{book.title}</div>
              </td>

              <td className="p-3 text-gray-700">{book.author}</td>

              <td className="p-3">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                  {book.genre}
                </span>
              </td>

              <td className="p-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${book.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                    }`}
                >
                  {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
                </span>
              </td>

              <td className="p-3 text-blue-600 font-semibold">₹{book.price}</td>

              <td className="p-3 text-xs text-gray-500">
                {new Date(book.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() => alert("🔧 Edit functionality coming soon")}
                  className="text-blue-600 hover:underline"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="text-red-600 hover:underline"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
