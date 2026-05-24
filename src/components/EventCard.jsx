import '../styles/components.css'

function EventCard({ event, onManage }) {
  return (
    <div className="event-card">
      <div className="event-card-content">
        <div className="event-card-icon">▣</div>
        <div className="event-card-details">
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-meta">
            {event.date} · {event.photoCount.toLocaleString()} photos
          </p>
        </div>
      </div>
      <button 
        onClick={() => onManage(event.id)}
        className="event-card-action"
      >
        Manage →
      </button>
    </div>
  )
}

export default EventCard
