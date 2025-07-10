import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BookForm from "../components/BookForm";
import { BookPlus } from "lucide-react";
import api from "../services/axios";

export default function AddBook() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleAddBook = async (data) => {
    setLoading(true);
    try {
      await api.post("/books", data);
      toast.success("Book added successfully!");
      navigate("/admin");
    } catch (err) {
      toast.error("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Icon + Title */}
      <div className="flex items-center gap-2 mb-4 text-green-600">
        <BookPlus className="w-6 h-6" />
        <h2 className="text-lg font-bold">Add New Book</h2>
      </div>

      <BookForm onSubmit={handleAddBook} loading={loading} />
    </div>
  );
}
