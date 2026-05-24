import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import '../../styles/components.css'
import './EventDetail.css'

function EventDetail() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { eventId } = useParams()
  const fileInputRef = useRef(null)

  // TODO: Fetch event data from Firebase
  const [event] = useState({
    id: eventId || '1',
    title: 'Riya & Arjun',
    date: '14 February 2026',
    shareLink: `anmollamhe.app/event/abc123`
  })

  const [uploadedPhotos, setUploadedPhotos] = useState([])

  const [processingPhotos, setProcessingPhotos] = useState([])

  const [copySuccess, setCopySuccess] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleBack = () => {
    navigate('/admin/dashboard')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${event.shareLink}`)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`View photos from ${event.title}: https://${event.shareLink}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const processFiles = (files) => {
    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        return
      }

      // Create a unique ID for this file
      const fileId = Date.now() + index

      // Read file and create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        // Add to uploaded photos immediately with preview
        setUploadedPhotos(prev => [...prev, {
          id: fileId,
          url: reader.result,
          name: file.name,
          file: file
        }])

        // Simulate processing
        setProcessingPhotos(prev => [...prev, {
          id: fileId,
          name: file.name,
          status: 'uploading',
          progress: 0
        }])

        // Simulate upload progress
        simulateUpload(fileId, file.name)
      }
      reader.readAsDataURL(file)
    })
  }

  const simulateUpload = (fileId, fileName) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        // Mark as complete with random face count
        setProcessingPhotos(prev => 
          prev.map(p => 
            p.id === fileId 
              ? { ...p, status: 'complete', progress: 100, faces: Math.floor(Math.random() * 5) + 1 }
              : p
          )
        )

        // Remove from processing after 2 seconds
        setTimeout(() => {
          setProcessingPhotos(prev => prev.filter(p => p.id !== fileId))
        }, 2000)
      } else {
        setProcessingPhotos(prev => 
          prev.map(p => 
            p.id === fileId 
              ? { ...p, progress: Math.floor(progress) }
              : p
          )
        )
      }
    }, 500)
  }

  const handleDeletePhoto = (photoId) => {
    // TODO: Implement delete from Firebase
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="event-detail-page">
      <Navbar userEmail={user?.email || 'admin@example.com'} onLogout={handleLogout} />
      
      {/* Back Button */}
      <div className="back-button-container">
        <button 
          onClick={handleBack}
          className="back-button"
          type="button"
        >
          ← Events
        </button>
      </div>
      
      <div className="event-detail-container">
        {/* Event Header */}
        <div className="event-header">
          <h1 className="event-title brand-title">{event.title}</h1>
          <p className="event-date">{event.date}</p>
          <div className="title-underline"></div>
        </div>

        {/* Shareable Link Section */}
        <section className="share-section">
          <h2 className="section-title label-text">SHAREABLE LINK</h2>
          <div className="share-link-container">
            <input 
              type="text" 
              value={event.shareLink} 
              readOnly 
              className="share-link-input"
            />
            <button 
              onClick={handleCopyLink}
              className="btn btn-secondary btn-copy"
            >
              {copySuccess ? 'COPIED!' : 'COPY'}
            </button>
          </div>
          <button 
            onClick={handleShareWhatsApp}
            className="btn btn-secondary btn-whatsapp"
          >
            Share on WhatsApp
          </button>
        </section>

        {/* Upload Section */}
        <section className="upload-section">
          <h2 className="section-title label-text">UPLOAD PHOTOS</h2>
          <div 
            className="upload-dropzone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="upload-input"
            />
            <div className="upload-content">
              <span className="upload-icon">⤒</span>
              <p className="upload-text">Drag photos here or click to browse</p>
              <p className="upload-hint">JPG · PNG · up to 50 MB each</p>
            </div>
          </div>
        </section>

        {/* Uploaded Photos Section */}
        {uploadedPhotos.length > 0 && (
          <section className="uploaded-section">
            <h2 className="section-title label-text">UPLOADED ({uploadedPhotos.length})</h2>
            <div className="photo-grid">
              {uploadedPhotos.map(photo => (
                <div key={photo.id} className="photo-thumbnail">
                  <div className="photo-thumbnail-inner">
                    <img 
                      src={photo.url} 
                      alt={photo.name}
                      className="photo-image"
                    />
                    <button 
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="photo-delete"
                      aria-label="Delete photo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Processing Section */}
        {processingPhotos.length > 0 && (
          <section className="processing-section">
            <h2 className="section-title label-text">PROCESSING</h2>
            <div className="processing-list">
              {processingPhotos.map(photo => (
                <div key={photo.id} className="processing-item">
                  <span className="processing-name">{photo.name}</span>
                  {photo.status === 'complete' ? (
                    <span className="processing-status success">
                      ✓ Faces detected ({photo.faces})
                    </span>
                  ) : (
                    <div className="processing-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${photo.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{photo.progress}% uploading</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default EventDetail
