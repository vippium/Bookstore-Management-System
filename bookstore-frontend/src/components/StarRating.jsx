import { useState, useEffect } from 'react'
import { Star, Trash2 } from 'lucide-react'
import api from '../services/axios'
import toast from 'react-hot-toast'

export default function StarRating ({ bookId, onRated, readOnly = false }) {
  const [hovered, setHovered] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [avgRating, setAvgRating] = useState(null)
  const [count, setCount] = useState(0)
  const [review, setReview] = useState('')
  const [userReviewExists, setUserReviewExists] = useState(false)

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/ratings/book/${bookId}`)
      const ratings = res.data?.ratings || []
      if (Array.isArray(ratings)) {
        const total = ratings.reduce((sum, r) => sum + r.stars, 0)
        const average = total / (ratings.length || 1)
        setAvgRating(average.toFixed(1))
        setCount(ratings.length)
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
      setAvgRating(null)
      setCount(0)
    }
  }

  const fetchUserRating = async () => {
    if (readOnly) return

    try {
      const res = await api.get('/ratings/mine')
      const found = res.data.find(r => {
        const rBookId = typeof r.book === 'string' ? r.book : r.book._id
        return rBookId === bookId
      })
      if (found) {
        setUserRating(found.stars)
        setReview(found.review || '')
        setUserReviewExists(true)
      } else {
        setUserRating(0)
        setReview('')
        setUserReviewExists(false)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
      } else {
        console.error('Error fetching user rating:', error)
      }
      setUserRating(0)
      setReview('')
      setUserReviewExists(false)
    }
  }

  const submitRating = async () => {
    if (userRating === 0) {
      toast.error('Please select a star rating.')
      return
    }
    try {
      await api.post(`/ratings/${bookId}`, {
        stars: userRating,
        review: review.trim()
      })
      toast.success('Rating submitted!')
      fetchRatings()
      fetchUserRating()
      onRated?.()
    } catch (error) {
      console.error('Failed to submit rating:', error)
      toast.error(error.response?.data?.message || 'Failed to submit rating')
    }
  }

  const deleteRating = async () => {
    try {
      const res = await api.get('/ratings/mine')
      const found = res.data.find(r => {
        const rBookId = typeof r.book === 'object' ? r.book._id : r.book
        return rBookId === bookId
      })

      if (!found) {
        toast.error('Your review for this book was not found.')
        return
      }

      await api.delete(`/ratings/${found._id}`)
      setUserRating(0)
      setReview('')
      setUserReviewExists(false)
      toast.success('Rating deleted')
      fetchRatings()
      onRated?.()
    } catch (error) {
      console.error('Failed to delete rating:', error)
      toast.error('Failed to delete rating')
    }
  }

  useEffect(() => {
    fetchRatings()
    if (!readOnly) {
      fetchUserRating()
    }
  }, [bookId, readOnly])

  return (
    <div
      className={`${
        readOnly
          ? 'flex items-center gap-1'
          : 'p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200'
      }`}
    >
      {!readOnly && (
        <h4 className='text-md font-semibold text-blue-600 mb-3'>
          Your Rating & Review
        </h4>
      )}

      {/* Display stars for interaction or just average */}
      <div className={`flex gap-1 items-center ${!readOnly ? 'mb-3' : ''}`}>
        {[1, 2, 3, 4, 5].map(val => (
          <Star
            key={val}
            size={readOnly ? 16 : 24}
            className={`${
              readOnly
                ? avgRating && parseFloat(avgRating) >= val
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300 fill-transparent'
                : (hovered || userRating) >= val
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            } ${readOnly ? '' : 'cursor-pointer transition duration-150'}`}
            onMouseEnter={readOnly ? null : () => setHovered(val)}
            onMouseLeave={readOnly ? null : () => setHovered(0)}
            onClick={readOnly ? null : () => setUserRating(val)}
          />
        ))}
        {readOnly ? (
          <>
            {avgRating && parseFloat(avgRating) > 0 ? (
              <span className='text-sm font-semibold text-gray-700 ml-1'>
                {avgRating}{' '}
                <span className='text-gray-500 text-xs'>({count} ratings)</span>
              </span>
            ) : (
              <span className='text-sm text-gray-500 ml-1'>No ratings yet</span>
            )}
          </>
        ) : (
          userRating > 0 && (
            <button
              onClick={deleteRating}
              className='ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors flex items-center gap-1'
            >
              <Trash2 className='w-4 h-4' /> Remove Review
            </button>
          )
        )}
      </div>

      {!readOnly && userRating > 0 && (
        <div className='space-y-3'>
          <textarea
            placeholder='Share your thoughts about this book (optional)...'
            value={review}
            onChange={e => setReview(e.target.value)}
            className='w-full border border-gray-300 rounded-lg text-sm p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all min-h-[80px]'
            rows={3}
          />
          <button
            onClick={submitRating}
            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors duration-200 transform hover:scale-105'
          >
            {userReviewExists ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Average Rating Summary for interactive component */}
      {!readOnly && avgRating && (
        <div className='text-sm text-gray-600 mt-4 pt-3 border-t border-gray-200'>
          Overall Average:{' '}
          <strong className='text-blue-700'>{avgRating} out of 5</strong> from{' '}
          {count} {count === 1 ? 'rating' : 'ratings'}
        </div>
      )}
      {!readOnly && !userRating && (
        <p className='text-sm text-gray-500 mt-2'>
          Select stars above to leave your rating and review!
        </p>
      )}
    </div>
  )
}
