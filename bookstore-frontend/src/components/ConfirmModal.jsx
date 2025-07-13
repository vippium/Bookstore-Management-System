import { useEffect, useRef, useState } from 'react'
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function ConfirmModal ({
  show,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  status = 'info'
}) {
  const [visible, setVisible] = useState(false)
  const modalRef = useRef()

  useEffect(() => {
    if (show) setVisible(true)
  }, [show])

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleClickOutside = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose()
    }
  }

  useEffect(() => {
    if (show) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [show])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const statusIcon = {
    success: <CheckCircle className='w-6 h-6 text-green-600' />,
    error: <XCircle className='w-6 h-6 text-red-600' />,
    info: <AlertTriangle className='w-6 h-6 text-yellow-500' />
  }[status]

  const titleColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-yellow-600'
  }[status]

  if (!show && !visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200 transform transition-all duration-300 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <div
            className={`flex items-center gap-2 font-semibold ${titleColor}`}
          >
            {statusIcon}
            <span>{title}</span>
          </div>
          <button onClick={handleClose}>
            <X className='w-5 h-5 text-gray-500 hover:text-gray-700' />
          </button>
        </div>

        {/* Message */}
        <p className='text-sm text-gray-600 mb-6'>{message}</p>

        {/* Actions */}
        <div className='flex justify-end gap-3'>
          <button
            onClick={handleClose}
            className='px-4 py-1.5 rounded-full bg-gray-100 text-sm hover:bg-gray-200'
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              handleClose()
            }}
            className={`px-4 py-1.5 rounded-full text-white text-sm transition ${
              status === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : status === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
