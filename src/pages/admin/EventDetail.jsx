import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { getEvent, getPhotos, savePhoto, deletePhoto, updateEvent, getFacesetToken, saveFacesetToken } from "../../firebase";
import { detectFaces, createFaceset, addFacesToFaceset, getFaceset } from "../../utils/facePlusPlus";
import "../../styles/components.css";
import "./EventDetail.css";

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

// Convert File to base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function EventDetail() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { eventId } = useParams();
  const fileInputRef = useRef(null);

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ev = await getEvent(eventId);
        setEvent(ev);
        const ph = await getPhotos(eventId);
        setPhotos(ph);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvent(false);
      }
    };
    load();
  }, [eventId]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const shareLink = event ? `${APP_URL}/event/${event.shareSlug}` : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(`View your photos from ${event?.name}: ${shareLink}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleFileSelect = (e) => processFiles(Array.from(e.target.files));
  const handleDrop = (e) => { e.preventDefault(); processFiles(Array.from(e.dataTransfer.files)); };
  const handleDragOver = (e) => e.preventDefault();

  const processFiles = (files) => {
    files.filter((f) => f.type.startsWith("image/")).forEach(uploadPhoto);
  };

  const uploadPhoto = async (file) => {
    const tempId = Date.now() + Math.random();

    setUploading((prev) => [...prev, { id: tempId, name: file.name, progress: 0, status: "reading" }]);

    try {
      // 1. Convert to base64 for storage + preview
      setUploading((prev) => prev.map((u) => u.id === tempId ? { ...u, status: "reading", progress: 30 } : u));
      const base64 = await fileToBase64(file);

      // 2. Detect faces using Face++ API
      setUploading((prev) => prev.map((u) => u.id === tempId ? { ...u, status: "detecting", progress: 50 } : u));

      let faceTokens = [];
      try {
        faceTokens = await detectFaces(file);
        
        // 3. Get or create faceset for this event
        if (faceTokens.length > 0) {
          setUploading((prev) => prev.map((u) => u.id === tempId ? { ...u, status: "adding faces", progress: 70 } : u));
          
          let facesetToken = await getFacesetToken(eventId);
          
          // Create faceset if it doesn't exist
          if (!facesetToken) {
            const facesetData = await getFaceset(eventId);
            if (facesetData) {
              facesetToken = facesetData.faceset_token;
            } else {
              facesetToken = await createFaceset(eventId);
            }
            await saveFacesetToken(eventId, facesetToken);
          }
          
          // Add faces to faceset
          await addFacesToFaceset(facesetToken, faceTokens);
        }
      } catch (faceErr) {
        console.warn("Face detection failed:", faceErr.message);
      }

      // 4. Save to Firestore (base64 image + face tokens)
      setUploading((prev) => prev.map((u) => u.id === tempId ? { ...u, status: "saving", progress: 85 } : u));

      const photoRef = await savePhoto(eventId, {
        fileName: file.name,
        imageData: base64,       // base64 stored in Firestore
        faceTokens,
        faceCount: faceTokens.length,
      });

      // 5. Update photoCount
      await updateEvent(eventId, { photoCount: photos.length + 1 });

      // 6. Add to local state
      const newPhoto = {
        id: photoRef.id,
        fileName: file.name,
        imageData: base64,
        faceTokens,
        faceCount: faceTokens.length,
      };
      setPhotos((prev) => [...prev, newPhoto]);

      setUploading((prev) => prev.map((u) => u.id === tempId ? { ...u, status: "done", progress: 100, faceCount: faceTokens.length } : u));
      setTimeout(() => setUploading((prev) => prev.filter((u) => u.id !== tempId)), 3000);

    } catch (err) {
      setUploading((prev) => prev.map((u) => u.id === tempId ? { ...u, status: "error", error: err.message } : u));
    }
  };

  const handleDeletePhoto = async (photo) => {
    try {
      await deletePhoto(eventId, photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      await updateEvent(eventId, { photoCount: Math.max(0, photos.length - 1) });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loadingEvent) {
    return (
      <div className="event-detail-page" style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
        <span className="spinner"></span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-page">
        <p style={{ color: "var(--text-primary)", textAlign: "center", padding: "100px 0" }}>Event not found.</p>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <Navbar userEmail={user?.email} onLogout={handleLogout} />
      <div className="event-detail-container">
        <button onClick={() => navigate("/admin/dashboard")} className="back-button" type="button">← Back to Events</button>
        {/* Event Header */}
        <div className="event-header">
          <div className="event-header-content">
            <h1 className="event-title brand-title">{event.name}</h1>
            <div className="title-underline"></div>
          </div>
          <p className="event-date">{event.date}</p>
        </div>

        {/* Shareable Link */}
        <section className="share-section">
          <h2 className="section-title label-text">SHAREABLE LINK</h2>
          <div className="share-link-container">
            <input type="text" value={shareLink} readOnly className="share-link-input" />
            <button onClick={handleCopyLink} className="btn btn-secondary btn-copy">
              {copySuccess ? "COPIED!" : "COPY"}
            </button>
          </div>
          <button onClick={handleShareWhatsApp} className="btn btn-secondary btn-whatsapp">
            Share on WhatsApp
          </button>
        </section>

        {/* Upload */}
        <section className="upload-section">
          <h2 className="section-title label-text">UPLOAD PHOTOS</h2>
          <div className="upload-dropzone" onDragOver={handleDragOver} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" multiple accept="image/*"
              onChange={handleFileSelect} className="upload-input" />
            <div className="upload-content">
              <span className="upload-icon">⤒</span>
              <p className="upload-text">Drag photos here or click to browse</p>
              <p className="upload-hint">JPG · PNG · up to 20 MB each</p>
            </div>
          </div>
        </section>

        {/* Processing */}
        {uploading.length > 0 && (
          <section className="processing-section">
            <h2 className="section-title label-text">PROCESSING</h2>
            <div className="processing-list">
              {uploading.map((u) => (
                <div key={u.id} className="processing-item">
                  <span className="processing-name">{u.name}</span>
                  {u.status === "done" && <span className="processing-status success">✓ Faces detected ({u.faceCount})</span>}
                  {u.status === "detecting" && <span className="processing-status">🔍 Detecting faces...</span>}
                  {u.status === "saving" && <span className="processing-status">💾 Saving...</span>}
                  {u.status === "error" && <span className="processing-status error">✗ {u.error}</span>}
                  {(u.status === "reading" || u.status === "uploading") && (
                    <div className="processing-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${u.progress}%` }}></div>
                      </div>
                      <span className="progress-text">{u.progress}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Uploaded Photos */}
        {photos.length > 0 && (
          <section className="uploaded-section">
            <h2 className="section-title label-text">UPLOADED ({photos.length})</h2>
            <div className="photo-grid">
              {photos.map((photo) => (
                <div key={photo.id} className="photo-thumbnail">
                  <div className="photo-thumbnail-inner">
                    <img src={photo.imageData} alt={photo.fileName} className="photo-image" loading="lazy" />
                    <button onClick={() => handleDeletePhoto(photo)} className="photo-delete" aria-label="Delete photo">✕</button>
                    {photo.faceCount > 0 && <span className="photo-face-badge">{photo.faceCount} 👤</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
