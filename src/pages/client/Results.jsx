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
    // If coming from upload flow with state, use that data
    if (location.state?.matchedPhotos) {
      const matchedPhotos = location.state.matchedPhotos;
      const name = location.state.eventName || "Event";
      
      setEventName(name);
      setPhotos(matchedPhotos);
      setLoading(false);
    } else {
      // If accessing directly via link, redirect to upload page
      navigate(`/event/${slug}/upload`, { replace: true });
    }
  }, [location, navigate, slug]);

  const handleBack = () => {
    navigate(`/event/${slug}`);
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    
    // Download each photo
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const link = document.createElement('a');
      link.href = photo.imageData;
      link.download = photo.fileName || `photo_${i + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const handleDownloadPhoto = (photo) => {
    const link = document.createElement('a');
    link.href = photo.imageData;
    link.download = photo.fileName || `photo_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePhotoClick = (photo) => {
    // Open photo in new tab
    const win = window.open();
    win.document.write(`<img src="${photo.imageData}" style="max-width:100%; height:auto;" />`);
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
      <div style={{ 
        background: "#1A1A1A", 
        borderBottom: "1px solid #2A2A2A", 
        padding: "1rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap"
      }}>
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
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ← {eventName}
        </button>

        <button
          onClick={handleDownloadAll}
          style={{
            background: "transparent",
            border: "1px solid #C9A961",
            color: "#C9A961",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 300ms ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(201, 169, 97, 0.1)";
            e.target.style.borderColor = "#E8C77A";
            e.target.style.color = "#E8C77A";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.borderColor = "#C9A961";
            e.target.style.color = "#C9A961";
          }}
        >
          ⤓ DOWNLOAD ALL
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {photos.length > 0 ? (
          <>
            {/* Title */}
            <div style={{ marginBottom: "2rem", display: "inline-block" }}>
              <h1 style={{ 
                fontFamily: "Cinzel, serif", 
                color: "#F5F0E6", 
                fontSize: "clamp(1.25rem, 4vw, 1.75rem)", 
                letterSpacing: "0.18em", 
                textTransform: "uppercase", 
                margin: "0 0 0.5rem", 
                fontWeight: 600 
              }}>
                We found {photos.length} photos of you
              </h1>
              <div style={{ width: "100%", height: "1px", background: "#C9A961" }}></div>
            </div>

            {/* Photo Grid */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
              gap: "1rem" 
            }}>
              {photos.map(photo => (
                <div 
                  key={photo.id}
                  style={{ 
                    position: "relative", 
                    aspectRatio: "1", 
                    borderRadius: "8px", 
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#1A1A1A",
                    border: "1px solid rgba(201, 169, 97, 0.15)"
                  }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  {/* Photo Image */}
                  <img 
                    src={photo.imageData} 
                    alt={photo.fileName}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover"
                    }}
                  />

                  {/* Download button overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPhoto(photo);
                    }}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      width: "32px",
                      height: "32px",
                      background: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "50%",
                      color: "#C9A961",
                      fontSize: "1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 300ms ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#C9A961";
                      e.currentTarget.style.color = "#0B0B0B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)";
                      e.currentTarget.style.color = "#C9A961";
                    }}
                    className="download-btn"
                  >
                    ⤓
                  </button>
                </div>
              ))}
            </div>

            <style>{`
              .download-btn {
                opacity: 0;
              }
              div:hover .download-btn {
                opacity: 1;
              }
            `}</style>
          </>
        ) : (
          /* Empty State */
          <div style={{ 
            textAlign: "center", 
            padding: "4rem 2rem",
            color: "#9A9A9A"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#F5F0E6" }}>
              No photos matched
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              Try a clearer selfie
            </p>
            <button
              onClick={() => navigate(`/event/${slug}/upload`)}
              style={{
                marginTop: "1.5rem",
                background: "transparent",
                border: "1px solid #C9A961",
                color: "#C9A961",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "12px 32px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 300ms ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(201, 169, 97, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
