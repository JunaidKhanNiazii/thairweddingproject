import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import '../../styles/components.css'
import './CreateEvent.css'

function CreateEvent() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    coverImage: null
  })
  const [coverImagePreview, setcoverImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      setFormData(prev => ({ ...prev, coverImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setcoverImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.eventName.trim()) {
      setError('Event name is required')
      return
    }

    if (!formData.eventDate) {
      setError('Event date is required')
      return
    }

    setLoading(true)

    try {
      // TODO: Implement Firebase event creation
      console.log('Creating event:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate back to dashboard
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/dashboard')
  }

  return (
    <div className="create-event-page">
      <Navbar userEmail={user?.email || 'admin@example.com'} onLogout={handleLogout} />
      
      {/* Back Button */}
      <div className="back-button-container">
        <button 
          onClick={handleCancel}
          className="back-button"
          type="button"
        >
          ← Back to events
        </button>
      </div>
      
      <div className="create-event-container">
        {/* Title */}
        <div className="create-event-header">
          <h1 className="create-event-title brand-title">CREATE NEW EVENT</h1>
          <div className="title-underline"></div>
        </div>

        {/* Form */}
        <form className="create-event-form" onSubmit={handleSubmit}>
          {/* Event Name */}
          <div className="input-group">
            <label htmlFor="eventName" className="input-label">
              Event Name
            </label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              className="input-field"
              placeholder="e.g. Riya & Arjun Wedding"
              value={formData.eventName}
              onChange={handleInputChange}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* Event Date */}
          <div className="input-group">
            <label htmlFor="eventDate" className="input-label">
              Event Date
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              className="input-field"
              value={formData.eventDate}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Cover Image */}
          <div className="input-group">
            <label htmlFor="coverImage" className="input-label">
              Cover Image (optional)
            </label>
            <div className="upload-area">
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="upload-input"
              />
              <label htmlFor="coverImage" className="upload-label">
                {coverImagePreview ? (
                  <div className="upload-preview">
                    <img src={coverImagePreview} alt="Cover preview" />
                    <div className="upload-overlay">
                      <span>⤒ Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">⤒</span>
                    <span>Click to upload</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary btn-cancel"
              disabled={loading}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-small"></span>
                  CREATING...
                </>
              ) : (
                'CREATE EVENT'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent
