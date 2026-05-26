import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const [eventName, setEventName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.matchedPhotos) {
      setEventName(location.state.eventName || "Event");
      setPhotos(location.state.matchedPhotos);
      setLoading(false);
    } else {
      navigate(`/event/${slug}/upload`, { replace: true });
    }
  }, [location, navigate, slug]);

  // Get the correct image src — Storage URL or base64
  const getImageSrc = (photo) => photo.url || photo.imageData || "";

  const handleDownloadPhoto = async (photo) => {
    const src = getImageSrc(photo);
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = photo.fileName || `photo_${photo.id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback for base64
      const a = document.createElement("a");
      a.href = src;
      a.download = photo.fileName || `photo_${photo.id}.jpg`;
      a.click();
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < photos.length; i++) {
      await handleDownloadPhoto(photos[i]);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  const handlePhotoClick = (photo) => {
    window.open(getImageSrc(photo), "_blank");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B0B0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #C9A961", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B0B", fontFamily: "Montserrat, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1A1A1A", borderBottom: "1px solid #2A2A2A", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <button onClick={() => navigate(`/event/${slug}`)}
          style={{ background: "transparent", border: "none", color: "#C9A961", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}>
          ← {eventName}
        </button>
        {photos.length > 0 && (
          <button onClick={handleDownloadAll}
            style={{ background: "transparent", border: "1px solid #C9A961", color: "#C9A961", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>
            ⤓ DOWNLOAD ALL
          </button>
        )}
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {photos.length > 0 ? (
          <>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E6", fontSize: "clamp(1.25rem, 4vw, 1.75rem)", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 0.5rem", fontWeight: 600 }}>
                We found {photos.length} photo{photos.length !== 1 ? "s" : ""} of you
              </h1>
              <div style={{ width: "100%", height: "1px", background: "#C9A961" }}></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
              {photos.map((photo) => (
                <div key={photo.id}
                  style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", cursor: "pointer", background: "#1A1A1A", border: "1px solid rgba(201,169,97,0.15)" }}
                  onClick={() => handlePhotoClick(photo)}>
                  <img src={getImageSrc(photo)} alt={photo.fileName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownloadPhoto(photo); }}
                    style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", width: 32, height: 32, background: "rgba(0,0,0,0.8)", border: "none", borderRadius: "50%", color: "#C9A961", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ⤓
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
            <p style={{ fontSize: "1rem", color: "#F5F0E6", marginBottom: "0.5rem" }}>No photos matched</p>
            <p style={{ fontSize: "0.875rem", color: "#9A9A9A" }}>Try a clearer selfie</p>
            <button onClick={() => navigate(`/event/${slug}/upload`)}
              style={{ marginTop: "1.5rem", background: "transparent", border: "1px solid #C9A961", color: "#C9A961", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "12px 32px", borderRadius: "6px", cursor: "pointer" }}>
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
