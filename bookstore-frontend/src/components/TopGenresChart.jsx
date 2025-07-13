import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import api from '../services/axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function TopGenresChart () {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/analytics/genres')
      .then(res => {
        if (Array.isArray(res.data)) setGenres(res.data)
      })
      .catch(() => setGenres([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className='text-sm text-gray-500'>Loading genres...</p>
  if (!genres || !genres.length)
    return <p className='text-sm text-gray-500'>No genre data available</p>

  const data = {
    labels: genres.map(g => g._id || 'Unknown'),
    datasets: [
      {
        label: 'Books Sold',
        data: genres.map(g => g.booksSold),
        backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa']
      }
    ]
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-md'>
      <h2 className='text-lg font-semibold mb-3 text-purple-700'>
        Top-Selling Genres
      </h2>
      <Pie data={data} />
    </div>
  )
}
