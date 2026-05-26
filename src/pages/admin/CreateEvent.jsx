import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { createEvent, uploadFile, updateEvent } from "../../firebase";
import { createFaceSet } from "../../utils/faceApi";
import "../../styles/components.css";
import "./CreateEvent.css";

const generateSlug = () => Math.random().toString(36).substring(2, 10);

function CreateEvent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({ eventName: "", eventDate: "", coverImage: null });
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload an image file"); return; }
    setFormData((prev) => ({ ...prev, coverImage: file }));
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.eventName.trim()) { setError("Event name is required"); return; }
    if (!formData.eventDate) { setError("Event date is required"); return; }
    setLoading(true);

    try {
      const slug = generateSlug();

      // 1. Create event in Firestore
      const eventId = await createEvent({
        name: formData.eventName.trim(),
        date: formData.eventDate,
        coverUrl: null,
        shareSlug: slug,
        ownerUid: user.uid,
      });

      // 2. Upload cover to Firebase Storage
      if (formData.coverImage) {
        const coverUrl = await uploadFile(
          `events/${eventId}/cover/cover.jpg`,
          formData.coverImage
        );
        await updateEvent(eventId, { coverUrl });
      }

      // 3. Create FaceSet on Face++ for this event
      try {
        await createFaceSet(eventId);
      } catch (faceErr) {
        console.warn("FaceSet creation failed:", faceErr.message);
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <Navbar userEmail={user?.email} onLogout={handleLogout} />
      <div className="back-button-container">
        <button onClick={() => navigate("/admin/dashboard")} className="back-button" type="button">
          ← Back to events
        </button>
      </div>
      <div className="create-event-container">
        <div className="create-event-header">
          <h1 className="create-event-title brand-title">CREATE NEW EVENT</h1>
          <div className="title-underline"></div>
        </div>
        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="eventName" className="input-label">Event Name</label>
            <input id="eventName" name="eventName" type="text" className="input-field"
              placeholder="e.g. Riya & Arjun Wedding" value={formData.eventName}
              onChange={handleInputChange} disabled={loading} autoComplete="off" />
          </div>
          <div className="input-group">
            <label htmlFor="eventDate" className="input-label">Event Date</label>
            <input id="eventDate" name="eventDate" type="date" className="input-field"
              value={formData.eventDate} onChange={handleInputChange} disabled={loading} />
          </div>
          <div className="input-group">
            <label htmlFor="coverImage" className="input-label">Cover Image (optional)</label>
            <div className="upload-area">
              <input id="coverImage" type="file" accept="image/*" onChange={handleImageUpload}
                disabled={loading} className="upload-input" />
              <label htmlFor="coverImage" className="upload-label">
                {coverPreview ? (
                  <div className="upload-preview">
                    <img src={coverPreview} alt="Cover preview" />
                    <div className="upload-overlay"><span>⤒ Click to change</span></div>
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
          {error && <div className="error-message" role="alert">{error}</div>}
          <div className="form-actions">
            <button type="button" onClick={() => navigate("/admin/dashboard")}
              className="btn btn-secondary btn-cancel" disabled={loading}>CANCEL</button>
            <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
              {loading ? <><span className="spinner spinner-small"></span>CREATING...</> : "CREATE EVENT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
