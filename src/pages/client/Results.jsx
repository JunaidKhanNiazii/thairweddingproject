import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [eventName, setEventName] = useState("Riya & Arjun");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch matched photos from Firebase
    // Simulate loading
    setTimeout(() => {
      // Mock data for testing
      setPhotos([
        { id: 1, url: "/placeholder1.jpg", thumbnail: "/placeholder1.jpg" },
        { id: 2, url: "/placeholder2.jpg", thumbnail: "/placeholder2.jpg" },
        { id: 3, url: "/placeholder3.jpg", thumbnail: "/placeholder3.jpg" },
        { id: 4, url: "/placeholder4.jpg", thumbnail: "/placeholder4.jpg" },
        { id: 5, url: "/placeholder5.jpg", thumbnail: "/placeholder5.jpg" },
        { id: 6, url: "/placeholder6.jpg", thumbnail: "/placeholder6.jpg" },
      ]);
      setLoading(false);
    }, 1000);
  }, [slug]);

  const handleBack = () => {
    navigate(`/event/${slug}`);
  };

  const handleDownloadAll = () => {
    // TODO: Implement download all as zip
    alert("Download all coming soon!");
  };

  const handleDownloadPhoto = (photoId) => {
    // TODO: Implement single photo download
    console.log("Download photo:", photoId);
    alert("Download coming soon!");
  };

  const handlePhotoClick = (photoId) => {
    // TODO: Open lightbox
    console.log("Open lightbox for:", photoId);
    alert("Lightbox coming soon!");
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
                  onClick={() => handlePhotoClick(photo.id)}
                >
                  {/* Placeholder for image */}
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "#2A2A2A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9A9A9A",
                    fontSize: "0.75rem"
                  }}>
                    Photo {photo.id}
                  </div>

                  {/* Download button overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPhoto(photo.id);
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
