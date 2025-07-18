import { useEffect, useState } from 'react'
import api from '../services/axios'
import { Link } from 'react-router-dom'
import { Listbox } from '@headlessui/react'
import { LibraryBig, Search, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState('All Genres')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [activeFilterType, setActiveFilterType] = useState('Title/Author')
  const [loading, setLoading] = useState(true)

  const booksPerPage = 12
  const filterTypes = ['Genre', 'Title/Author', 'Price Range']

  useEffect(() => {
    let isMounted = true

    const fetchBooks = async () => {
      try {
        const res = await api.get('/books')
        if (isMounted) {
          setBooks(res.data)
        }
      } catch (error) {
        console.error('Failed to fetch books:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchBooks()

    const timeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false)
      }
    }, 40000)

    return () => {
      isMounted = false
      clearTimeout(timeout)
    }
  }, [])

  const genres = ['All Genres', ...new Set(books.map(book => book.genre))]

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchInput)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [searchInput])

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())

    const matchesGenre =
      selectedGenre === 'All Genres' || book.genre === selectedGenre

    const price = book.price
    const min = parseFloat(minPrice)
    const max = parseFloat(maxPrice)

    let matchesPrice = true
    if (!isNaN(min) && price < min) matchesPrice = false
    if (!isNaN(max) && price > max) matchesPrice = false

    return matchesSearch && matchesGenre && matchesPrice
  })

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  )

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className='px-4 md:px-8 py-6 max-w-7xl mx-auto'>
      <div className='flex items-center gap-2 text-blue-700 mb-6 text-2xl font-bold'>
        <LibraryBig className='w-7 h-7' />
        <span>Books Available</span>
      </div>

      {/* Filters */}
      <div className='flex flex-col md:flex-row items-center mb-8 gap-4 md:justify-center'>
        <div className='flex-1 w-full max-w-2xl mx-auto'>
          {activeFilterType === 'Genre' && (
            <Listbox
              value={selectedGenre}
              onChange={val => {
                setSelectedGenre(val)
                setCurrentPage(1)
              }}
            >
              {({ open }) => (
                <div className='relative'>
                  <Listbox.Button
                    className={`w-full py-2 px-4 border rounded-full shadow-sm bg-white text-sm flex justify-between items-center transition-all ${
                      open
                        ? 'border-blue-400 ring-2 ring-blue-400'
                        : 'border-blue-300'
                    }`}
                  >
                    <span className='flex-1 text-center'>{selectedGenre}</span>
                    <ChevronDown className='w-4 h-6 ml-2 text-gray-500' />
                  </Listbox.Button>

                  <Listbox.Options className='absolute mt-2 w-full bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-auto text-sm animate-fade-in origin-top'>
                    {genres.map((genre, i) => (
                      <Listbox.Option
                        key={i}
                        value={genre}
                        className={({ active }) =>
                          `px-4 py-2 cursor-pointer text-center ${
                            active
                              ? 'bg-blue-100 text-blue-900'
                              : 'text-gray-700'
                          }`
                        }
                      >
                        {genre}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              )}
            </Listbox>
          )}

          {activeFilterType === 'Title/Author' && (
            <div className='relative w-full'>
              <span className='absolute inset-y-0 left-3 flex items-center text-gray-400'>
                <Search className='w-5 h-5' />
              </span>
              <input
                type='text'
                placeholder='Search by title or author...'
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-blue-300 rounded-full shadow- focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-normal text-center'
              />
            </div>
          )}

          {activeFilterType === 'Price Range' && (
            <div className='flex gap-4 w-full'>
              <input
                type='number'
                placeholder='Min Price'
                value={minPrice}
                onChange={e => {
                  setMinPrice(e.target.value)
                  setCurrentPage(1)
                }}
                className='w-1/2 px-4 py-2 border border-blue-300 rounded-full shadow- focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-normal text-center'
              />
              <input
                type='number'
                placeholder='Max Price'
                value={maxPrice}
                onChange={e => {
                  setMaxPrice(e.target.value)
                  setCurrentPage(1)
                }}
                className='w-1/2 px-4 py-2 border border-blue-300 rounded-full shadow- focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-normal text-center'
              />
            </div>
          )}
        </div>

        {/* Filter Type Selector */}
        <div className='relative w-full md:w-auto md:ml-auto'>
          <Listbox value={activeFilterType} onChange={setActiveFilterType}>
            {({ open }) => (
              <div className='relative'>
                <Listbox.Button
                  className={`w-full py-2 px-4 border rounded-full shadow-sm bg-white text-sm flex items-center transition-all ${
                    open
                      ? 'border-blue-400 ring-2 ring-blue-400'
                      : 'border-blue-300'
                  }`}
                >
                  <span className='flex-1 text-center'>
                    Filter By: {activeFilterType}
                  </span>
                  <ChevronDown className='w-4 h-6 ml-2 text-gray-500' />
                </Listbox.Button>
                <Listbox.Options className='absolute mt-2 w-full bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-auto text-sm animate-fade-in origin-top'>
                  {filterTypes.map((type, i) => (
                    <Listbox.Option
                      key={i}
                      value={type}
                      className={({ active }) =>
                        `px-4 py-2 cursor-pointer text-center ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                        }`
                      }
                    >
                      {type}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            )}
          </Listbox>
        </div>
      </div>

      {/* Spinner / Empty / Books */}
      {loading ? (
        <div className='flex justify-center items-center py-20 text-blue-600 text-sm'>
          <span className='animate-spin mr-2 w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full'></span>
          Loading books...
        </div>
      ) : filteredBooks.length === 0 ? (
        <p className='text-gray-500 text-center mt-8'>
          No books found matching your criteria.
        </p>
      ) : (
        <>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
            >
              {paginatedBooks.map(book => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className='block relative border rounded-3xl shadow-md hover:shadow-2xl transition-all duration-200 bg-white overflow-hidden hover:scale-[1.09] cursor-pointer'
                >
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    onError={e => (e.target.src = '/placeholder.jpeg')}
                    className='w-full h-56 object-cover'
                  />
                  <div className='p-4'>
                    <span className='inline-block mb-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold'>
                      {book.genre}
                    </span>
                    <h3 className='text-xl font-semibold text-blue-700'>
                      {book.title
                        .split(new RegExp(`(${search})`, 'gi'))
                        .map((part, i) =>
                          part.toLowerCase() === search.toLowerCase() ? (
                            <mark key={i} className='bg-yellow-200'>
                              {part}
                            </mark>
                          ) : (
                            part
                          )
                        )}
                    </h3>
                    <p className='text-sm text-gray-600 mt-1'>
                      by {book.author}
                    </p>
                    <p className='mt-2 text-blue-600 font-bold text-lg'>
                      ₹{book.price}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className='flex justify-center mt-10 gap-2 flex-wrap'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-1 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-1 rounded-full transition border ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-blue-700 border-blue-300 hover:bg-blue-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-1 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
