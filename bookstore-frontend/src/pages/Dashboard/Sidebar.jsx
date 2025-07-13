export default function Sidebar ({ setSection, current }) {
  const menu = [
    { key: 'user', label: 'User Info' },
    { key: 'orders', label: 'My Orders' },
    { key: 'summary', label: 'Order Summary' }
  ]

  return (
    <div className='w-48 bg-white rounded-2xl shadow border border-blue-100 p-4 space-y-3'>
      {menu.map(item => (
        <button
          key={item.key}
          onClick={() => setSection(item.key)}
          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
            current === item.key
              ? 'bg-blue-600 text-white'
              : 'hover:bg-blue-50 text-blue-700'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
