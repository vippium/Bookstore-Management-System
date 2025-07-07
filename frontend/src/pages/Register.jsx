import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/axios'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function Register () {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post('/auth/register', form)
      login(res.data.token) // ✅ updates global context and navbar
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className='p-8 max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Register</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={form.name}
          onChange={handleChange}
          className='w-full p-2 border rounded'
          required
        />

        <input
          type='email'
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          className='w-full p-2 border rounded'
          required
        />

        <input
          type='password'
          name='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          className='w-full p-2 border rounded'
          required
        />

        {error && <p className='text-red-500'>{error}</p>}

        <button
          type='submit'
          className='bg-green-600 text-white px-4 py-2 rounded'
        >
          Register
        </button>
      </form>
    </div>
  )
}
