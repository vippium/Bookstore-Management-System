import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import BookForm from '../components/BookForm'
import { BookPlus } from 'lucide-react'
import api from '../services/axios'

export default function AddBook () {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAddBook = async data => {
    setLoading(true)
    try {
      await api.post('/books', data)
      toast.success('Book added successfully!')
      navigate('/admin')
    } catch (err) {
      toast.error('Failed to add book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-blue-700 mb-5 text-center flex items-center justify-center gap-2'>
        <BookPlus className='w-6 h-6 text-blue-600' />
        Add New Book
      </h2>
      <BookForm onSubmit={handleAddBook} loading={loading} />
    </div>
  )
}
