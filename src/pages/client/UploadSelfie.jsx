import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { searchFace } from "../../utils/faceApi";

export default function UploadSelfie() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  // Load event by slug
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const q = query(collection(db, "events"), where("shareSlug", "==", slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setEvent({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError("Failed to load event");
      }
    };
    loadEvent();
  }, [slug]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleFindPhotos = async () => {
    if (!selectedImage || !event) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Search selfie against event FaceSet on Face++
      const matches = await searchFace(event.id, selectedImage);

      // 2. Load all photos for this event from Firestore
      const photosSnap = await getDocs(collection(db, "events", event.id, "photos"));
      const allPhotos = photosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // 3. Find photos whose faceTokens overlap with matched tokens
      const matchedTokens = new Set(matches.map((m) => m.faceToken));
      const matchedPhotos = allPhotos.filter((photo) =>
        (photo.faceTokens || []).some((token) => matchedTokens.has(token))
      );

      // 4. Go to results
      navigate(`/event/${slug}/results`, {
        state: { matchedPhotos, eventName: event.name },
      });
    } catch (err) {
      setError(err.message || "Failed to find photos. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B0B", fontFamily: "Montserrat, sans-serif", padding: "1.5rem" }}>
      <button onClick={() => navigate(`/event/${slug}`)}
        style={{ background: "transparent", border: "none", color: "#C9A961", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", padding: "0.5rem 0", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        ← Back
      </button>

      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E6", fontSize: "clamp(1.5rem, 5vw, 2rem)", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 0.5rem", fontWeight: 600 }}>
          UPLOAD YOUR SELFIE
        </h1>
        <div style={{ width: "100%", height: "1px", background: "#C9A961", marginBottom: "1rem" }}></div>
        <p style={{ color: "#9A9A9A", fontSize: "0.875rem", marginBottom: "2rem" }}>
          We will find every photo of you
        </p>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="user" onChange={handleFileSelect} style={{ display: "none" }} />

        <div onClick={() => fileInputRef.current?.click()}
          style={{ background: "#1A1A1A", border: "2px dashed rgba(201,169,97,0.3)", borderRadius: "12px", padding: "3rem 2rem", cursor: "pointer", marginBottom: "1.5rem", transition: "all 300ms ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9A961"; e.currentTarget.style.background = "#2A2A2A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,169,97,0.3)"; e.currentTarget.style.background = "#1A1A1A"; }}>
          <div style={{ color: "#C9A961", fontSize: "2.5rem", marginBottom: "1rem" }}>⤒</div>
          <p style={{ color: "#F5F0E6", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Tap to upload</p>
          <p onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
            style={{ color: "#9A9A9A", fontSize: "0.75rem", cursor: "pointer", margin: 0 }}>
            (or use your camera)
          </p>
        </div>

        {previewUrl && (
          <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
            <img src={previewUrl} alt="Selfie preview"
              style={{ width: 150, height: 150, borderRadius: 12, objectFit: "cover", border: "2px solid #C9A961" }} />
          </div>
        )}

        <button onClick={handleFindPhotos} disabled={!selectedImage || loading}
          style={{
            background: selectedImage ? "linear-gradient(135deg, #E8C77A 0%, #C9A961 50%, #8C6E2B 100%)" : "#2A2A2A",
            color: selectedImage ? "#0B0B0B" : "#9A9A9A",
            fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.875rem",
            letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 40px",
            border: "none", borderRadius: 6, cursor: selectedImage ? "pointer" : "not-allowed",
            boxShadow: selectedImage ? "0 0 24px rgba(201,169,97,0.25)" : "none",
            width: "100%", opacity: loading ? 0.7 : 1, transition: "all 300ms ease",
          }}
          onMouseEnter={(e) => { if (selectedImage && !loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 36px rgba(201,169,97,0.45)"; } }}
          onMouseLeave={(e) => { if (selectedImage && !loading) { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 24px rgba(201,169,97,0.25)"; } }}>
          {loading ? "SEARCHING..." : "FIND MY PHOTOS"}
        </button>

        {error && <p style={{ color: "#D9534F", fontSize: "0.875rem", marginTop: "1rem" }}>{error}</p>}

        <p style={{ color: "#9A9A9A", fontSize: "0.75rem", marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <span>🛈</span> Your selfie is used only to match photos.
        </p>
      </div>
    </div>
  );
}
