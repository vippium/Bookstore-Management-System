import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
)

export default function SalesChart ({ stats }) {
  const [type, setType] = useState('bar')

  const labels = Array.isArray(stats) ? stats.map(item => item.date) : []
  const revenue = Array.isArray(stats) ? stats.map(item => item.revenue) : []

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenue,
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold text-blue-700'>
          Revenue (Last 7 Days)
        </h2>
        <div className='flex gap-2 text-sm'>
          <button
            onClick={() => setType('bar')}
            className={`px-2 py-1 rounded-full ${
              type === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setType('line')}
            className={`px-2 py-1 rounded-full ${
              type === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Line
          </button>
        </div>
      </div>

      {type === 'bar' ? (
        <Bar data={data} options={options} />
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  )
}
