import { useEffect, useState } from "react";
import api from "../services/axios";
import { Pencil, Trash2, Loader, ChevronUp, ChevronDown, ChevronsUpDown, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";


export default function BookManager() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [lastDeleted, setLastDeleted] = useState(null);

  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("default");
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);


  useEffect(() => {
    api
      .get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (bookId, bookTitle) => {
    toast((t) => (
      <div className="text-sm">
        <p>Delete <strong>{bookTitle}</strong>?</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const deleted = books.find((b) => b._id === bookId);
                setBooks((prev) => prev.filter((b) => b._id !== bookId));
                await api.delete(`/books/${bookId}`);
                toast.success("Book deleted");

                // Show undo for 5 seconds
                toast((undoToast) => (
                  <div className="text-sm">
                    <span>Undo delete?</span>
                    <button
                      className="ml-3 text-blue-600 font-medium"
                      onClick={() => {
                        setBooks((prev) => [deleted, ...prev]);
                        toast.dismiss(undoToast.id);
                      }}
                    >
                      Undo
                    </button>
                  </div>
                ), { duration: 5000 });

              } catch (err) {
                toast.error("Failed to delete");
              }
            }}
            className="px-3 py-1 rounded-full bg-red-600 text-white text-xs hover:bg-red-700"
          >
            Confirm
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-full bg-gray-200 text-xs hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
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
                  className={`text-xs font-medium px-2 py-1 rounded-full
    ${book.stock === 0
                      ? "bg-red-100 text-red-600"
                      : book.stock <= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {book.stock === 0
                    ? "Out of stock"
                    : book.stock <= 5
                      ? `${book.stock} (Low Stock)`
                      : `${book.stock} in stock`}
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
                  onClick={() => navigate(`/admin/books/${book._id}/edit`)}
                  className="text-blue-600 hover:underline"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => {
                    setBookToDelete(book);
                    setShowModal(true);
                  }}
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

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showModal}
        title="Delete Book"
        message={`Are you sure you want to delete "${bookToDelete?.title}"?`}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          try {
            setShowModal(false);
            const deleted = bookToDelete;
            setBooks((prev) => prev.filter((b) => b._id !== deleted._id));
            await api.delete(`/books/${deleted._id}`);
            setLastDeleted(deleted);

            // Show Undo Toast
            toast((t) => (
              <div className="flex items-center gap-4 text-sm">
                <span>
                  Deleted <strong>{deleted.title}</strong>
                </span>
                <button
                  className="text-blue-600 hover:underline font-medium"
                  onClick={async () => {
                    try {
                      await api.post("/books", deleted);
                      setBooks((prev) => [deleted, ...prev]);
                      toast.success("Book restored");
                    } catch {
                      toast.error("Restore failed");
                    }
                    toast.dismiss(t.id);
                    setLastDeleted(null);
                  }}
                >
                  Undo
                </button>
              </div>
            ), { duration: 5000 });
          } catch {
            toast.error("Failed to delete book");
          }
        }}
        status="error"
      />
    </div>
  );
}
