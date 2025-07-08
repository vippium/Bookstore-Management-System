import { useEffect, useState } from "react";
import api from "../services/axios";
import { Pencil, Trash2 } from "lucide-react";

export default function BookManager() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    await api.delete(`/books/${id}`);
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} className="border-t hover:bg-gray-50">
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">₹{book.price}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => alert("🔧 Edit functionality pending")}
                  className="text-blue-600 hover:underline"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="text-red-600 hover:underline"
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
