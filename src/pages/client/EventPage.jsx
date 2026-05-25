import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function EventPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const q = query(collection(db, "events"), where("shareSlug", "==", slug));
        const snap = await getDocs(q);
        if (snap.empty) {
          setNotFound(true);
        } else {
          setEvent({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B0B0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #C9A961", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B0B0B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
        <p style={{ color: "#9A9A9A", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" }}>Event not found</p>
        <p style={{ color: "#2A2A2A", fontSize: 12, marginTop: 8 }}>This link may be invalid or expired.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", maxHeight: "100vh", background: "#0B0B0B", fontFamily: "Montserrat, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", padding: "0 0 5px 0", margin: 0 }}>
        <img 
          src="/logo.png" 
          alt="Anmol Lamhe Photography" 
          style={{ height: "90px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
        />
      </div>

      {/* Cover Image */}
      {event.coverUrl && (
        <div style={{ width: "100%", height: "200px", overflow: "hidden", flexShrink: 0 }}>
          <img src={event.coverUrl} alt={event.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1.5rem 1.5rem", textAlign: "center" }}>
        {/* Card Container */}
        <div 
          style={{ 
            background: "#1A1A1A", 
            border: "1px solid rgba(201, 169, 97, 0.15)", 
            borderRadius: "12px", 
            padding: "2rem 1.5rem", 
            width: "100%", 
            maxWidth: "480px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.45)",
            transition: "all 300ms ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#C9A961";
            e.currentTarget.style.boxShadow = "0 0 24px rgba(201, 169, 97, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 97, 0.15)";
            e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.45)";
          }}
        >
          {/* Event Name */}
          <h1 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E6", fontSize: "clamp(1.5rem, 5vw, 2rem)", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 1rem", fontWeight: 600 }}>
            {event.name}
          </h1>

          {/* Date with lines */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", justifyContent: "center" }}>
            <div style={{ width: "60px", height: "1px", background: "#C9A961" }}></div>
            <p style={{ color: "#9A9A9A", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, whiteSpace: "nowrap" }}>
              {event.date}
            </p>
            <div style={{ width: "60px", height: "1px", background: "#C9A961" }}></div>
          </div>

          {/* Tagline */}
          <p style={{ color: "#C9A961", fontSize: "0.875rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
            ⌐ Find your photos in seconds ⌐
          </p>

          {/* Button */}
          <button
            style={{
              background: "linear-gradient(135deg, #E8C77A 0%, #C9A961 50%, #8C6E2B 100%)",
              color: "#0B0B0B", fontFamily: "Montserrat, sans-serif", fontWeight: 700,
              fontSize: "0.875rem", letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "16px 40px", border: "none", borderRadius: 6, cursor: "pointer",
              boxShadow: "0 0 24px rgba(201,169,97,0.25)", width: "100%",
              transition: "transform 300ms ease, box-shadow 300ms ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 0 36px rgba(201,169,97,0.45)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 0 24px rgba(201,169,97,0.25)";
            }}
            onClick={() => navigate(`/event/${slug}/upload`)}
          >
            FIND MY PHOTOS →
          </button>

          {/* Footer */}
          <p style={{ color: "#F5F0E6", fontSize: "0.75rem", marginTop: "1.5rem", letterSpacing: "0.05em", margin: "1.5rem 0 0 0" }}>
            Powered by Anmol Lamhe Photography
          </p>
        </div>
      </div>
    </div>
  );
}
