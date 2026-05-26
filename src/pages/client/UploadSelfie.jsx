import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";

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

  useEffect(() => {
    const loadEvent = async () => {
      try {
        // Find event by slug
        const { getEvents } = await import("../../firebase");
        const events = await getEvents();
        const foundEvent = events.find(e => e.shareSlug === slug);
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError("Failed to load event");
      }
    };
    loadEvent();
  }, [slug]);

  const handleBack = () => {
    navigate(`/event/${slug}`);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFindPhotos = async () => {
    if (!selectedImage) {
      alert('Please upload a selfie first');
      return;
    }

    if (!event) {
      alert('Event not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Starting face search for event:', event.id);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      await new Promise((resolve) => {
        reader.onloadend = resolve;
      });
      
      const selfieBase64 = reader.result;
      
      // Call Cloud Function to search faces
      const functions = getFunctions();
      const searchFaces = httpsCallable(functions, 'searchFaces');
      
      console.log('🔎 Calling searchFaces Cloud Function...');
      const result = await searchFaces({
        eventId: event.id,
        selfieBase64: selfieBase64
      });
      
      const matchedPhotos = result.data.photos || [];
      console.log('✅ Found matches:', matchedPhotos.length);
      
      if (matchedPhotos.length === 0) {
        console.log('⚠️ No face matches found');
        navigate(`/event/${slug}/results`, { 
          state: { 
            matchedPhotos: [],
            eventName: event.name 
          } 
        });
        return;
      }
      
      // Navigate to results with matched photos
      navigate(`/event/${slug}/results`, { 
        state: { 
          matchedPhotos: matchedPhotos.map(photo => ({
            id: photo.id,
            imageData: photo.url, // Use the signed URL from Cloud Function
            fileName: `photo_${photo.id}.jpg`,
            faceCount: photo.faceCount
          })),
          eventName: event.name 
        } 
      });
      
    } catch (err) {
      console.error('❌ Face matching error:', err);
      setError(err.message || 'Failed to find photos. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B0B", fontFamily: "Montserrat, sans-serif", padding: "1.5rem" }}>
      {/* Back Button */}
      <button 
        onClick={handleBack}
        style={{
          background: "transparent",
          border: "none",
          color: "#C9A961",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
          padding: "0.5rem 0",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        ← Back
      </button>

      {/* Content Container */}
      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        {/* Title */}
        <div style={{ display: "inline-block", marginBottom: "2rem" }}>
          <h1 style={{ 
            fontFamily: "Cinzel, serif", 
            color: "#F5F0E6", 
            fontSize: "clamp(1.5rem, 5vw, 2rem)", 
            letterSpacing: "0.18em", 
            textTransform: "uppercase", 
            margin: "0 0 0.5rem", 
            fontWeight: 600 
          }}>
            UPLOAD YOUR SELFIE
          </h1>
          <div style={{ width: "100%", height: "1px", background: "#C9A961" }}></div>
        </div>

        {/* Description */}
        <p style={{ color: "#9A9A9A", fontSize: "0.875rem", marginBottom: "2rem" }}>
          We'll find every photo of you
        </p>

        {/* Upload Area */}
        <div style={{ marginBottom: "1.5rem" }}>
          {/* File Upload Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          {/* Camera Input */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Upload Card */}
          <div 
            style={{
              background: "#1A1A1A",
              border: "2px dashed rgba(201, 169, 97, 0.3)",
              borderRadius: "12px",
              padding: "3rem 2rem",
              cursor: "pointer",
              transition: "all 300ms ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C9A961";
              e.currentTarget.style.background = "#2A2A2A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(201, 169, 97, 0.3)";
              e.currentTarget.style.background = "#1A1A1A";
            }}
          >
            <div style={{ color: "#C9A961", fontSize: "2.5rem", marginBottom: "1rem" }}>⤒</div>
            <p 
              onClick={handleUploadClick}
              style={{ 
                color: "#F5F0E6", 
                fontSize: "0.875rem", 
                marginBottom: "0.5rem",
                cursor: "pointer"
              }}
            >
              Tap to upload
            </p>
            <p 
              onClick={handleCameraClick}
              style={{ 
                color: "#9A9A9A", 
                fontSize: "0.75rem",
                cursor: "pointer",
                margin: 0
              }}
            >
              (or use your camera)
            </p>
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
            <img 
              src={previewUrl} 
              alt="Selfie preview" 
              style={{ 
                width: "150px", 
                height: "150px", 
                borderRadius: "12px", 
                objectFit: "contain",
                border: "2px solid #C9A961",
                background: "#1A1A1A"
              }}
            />
          </div>
        )}

        {/* Find Photos Button */}
        <button
          onClick={handleFindPhotos}
          disabled={!selectedImage || loading}
          style={{
            background: selectedImage ? "linear-gradient(135deg, #E8C77A 0%, #C9A961 50%, #8C6E2B 100%)" : "#2A2A2A",
            color: selectedImage ? "#0B0B0B" : "#9A9A9A",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "16px 40px",
            border: "none",
            borderRadius: 6,
            cursor: selectedImage ? "pointer" : "not-allowed",
            boxShadow: selectedImage ? "0 0 24px rgba(201,169,97,0.25)" : "none",
            width: "100%",
            transition: "all 300ms ease",
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (selectedImage && !loading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 0 36px rgba(201,169,97,0.45)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedImage && !loading) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 0 24px rgba(201,169,97,0.25)";
            }
          }}
        >
          {loading ? "PROCESSING..." : "FIND MY PHOTOS"}
        </button>

        {/* Info Text */}
        {error && (
          <p style={{ 
            color: "#ff6b6b", 
            fontSize: "0.875rem", 
            marginTop: "1rem",
            textAlign: "center"
          }}>
            {error}
          </p>
        )}
        
        <p style={{ 
          color: "#9A9A9A", 
          fontSize: "0.75rem", 
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem"
        }}>
          <span style={{ fontSize: "1rem" }}>🛈</span>
          Your selfie is used only to match.
        </p>
      </div>
    </div>
  );
}
