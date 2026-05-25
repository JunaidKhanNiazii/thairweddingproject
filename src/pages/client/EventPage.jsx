import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function EventPage() {
  const { slug } = useParams();
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
    <div style={{ minHeight: "100vh", background: "#0B0B0B", fontFamily: "Montserrat, sans-serif" }}>
      {event.coverUrl && (
        <div style={{ width: "100%", height: 320, overflow: "hidden", position: "relative" }}>
          <img src={event.coverUrl} alt={event.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #0B0B0B 100%)" }} />
        </div>
      )}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #E8C77A, #8C6E2B)", borderRadius: 8, margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#0B0B0B", fontWeight: 800, fontSize: 20 }}>A</span>
        </div>
        <h1 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E6", fontSize: "clamp(1.5rem, 5vw, 2.5rem)", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>
          {event.name}
        </h1>
        <p style={{ color: "#9A9A9A", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 48 }}>
          {event.date}
        </p>
        <p style={{ color: "#C9A961", fontSize: 13, letterSpacing: "0.15em", marginBottom: 32 }}>
          ⌐ Find your photos in seconds ⌐
        </p>
        <button
          style={{
            background: "linear-gradient(135deg, #E8C77A 0%, #C9A961 50%, #8C6E2B 100%)",
            color: "#0B0B0B", fontFamily: "Montserrat, sans-serif", fontWeight: 700,
            fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "16px 40px", border: "none", borderRadius: 6, cursor: "pointer",
            boxShadow: "0 0 24px rgba(201,169,97,0.25)", width: "100%", maxWidth: 320,
          }}
          onClick={() => alert("Selfie upload coming soon!")}
        >
          FIND MY PHOTOS →
        </button>
        <p style={{ color: "#2A2A2A", fontSize: 11, marginTop: 48, letterSpacing: "0.1em" }}>
          Powered by Anmol Lamhe Photography
        </p>
      </div>
    </div>
  );
}
