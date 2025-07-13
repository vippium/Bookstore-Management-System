import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/axios'
import toast from 'react-hot-toast'
import BookForm from '../components/BookForm'
import { PencilLine } from 'lucide-react'

export default function EditBook () {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then(res => setInitialData(res.data))
      .catch(() => toast.error('Failed to load book'))
  }, [id])

  const handleUpdate = async updatedData => {
    setLoading(true)
    try {
      await api.put(`/books/${id}`, updatedData)
      toast.success('Book updated!')
      navigate('/admin')
    } catch {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!initialData) return null

  return (
    <div className='max-w-2xl mx-auto p-6'>
      {/* Icon + Title */}
      <div className='flex items-center justify-center gap-2 mb-4 text-yellow-600'>
        <PencilLine className='w-6 h-6' />
        <h2 className='text-lg font-bold'>Edit Book</h2>
      </div>

      <BookForm
        initialData={initialData}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  )
}