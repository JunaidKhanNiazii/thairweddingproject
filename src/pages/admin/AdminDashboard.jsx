import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import EmptyState from "../../components/EmptyState";
import { getEvents } from "../../firebase";
import "../../styles/components.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // Sort newest first
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-dashboard">
      <Navbar userEmail={user?.email} onLogout={handleLogout} />
      <main className="admin-dashboard-content">
        <div className="container">
          <div className="admin-dashboard-header">
            <div className="admin-dashboard-header-left">
              <h1 className="admin-dashboard-title">MY EVENTS</h1>
              <div className="title-underline"></div>
            </div>
            <button onClick={() => navigate("/admin/events/create")} className="btn btn-primary">
              + NEW EVENT
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <span className="spinner"></span>
            </div>
          ) : events.length > 0 ? (
            <div className="events-list">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={{ ...event, title: event.name }}
                  onManage={(id) => navigate(`/admin/events/${id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📸"
              message="No events yet — create your first"
              actionText="+ NEW EVENT"
              onAction={() => navigate("/admin/events/create")}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
