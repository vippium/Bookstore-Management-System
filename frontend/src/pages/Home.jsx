import { useEffect, useState, useContext } from 'react';
import api from '../services/axios';
import CartContext from '../context/CartContext';

export default function Home() {
  const [books, setBooks] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await api.get('/books');
      setBooks(res.data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">📚 Available Books</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="mt-2 font-bold text-blue-700">₹{book.price}</p>
            <button
              onClick={() => addToCart(book)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
