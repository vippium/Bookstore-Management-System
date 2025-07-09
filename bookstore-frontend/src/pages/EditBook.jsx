import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import toast from "react-hot-toast";
import BookForm from "../components/BookForm";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setInitialData(res.data))
      .catch(() => toast.error("Failed to load book"));
  }, [id]);

  const handleUpdate = async (updatedData) => {
    setLoading(true);
    try {
      await api.put(`/books/${id}`, updatedData);
      toast.success("Book updated!");
      navigate("/admin");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Edit Book</h2>
      <BookForm initialData={initialData} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
}
