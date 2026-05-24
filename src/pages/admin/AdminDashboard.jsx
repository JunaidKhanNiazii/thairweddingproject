import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import EventCard from '../../components/EventCard'
import EmptyState from '../../components/EmptyState'
import '../../styles/components.css'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  // TODO: Replace with actual events from Firebase
  const [events] = useState([
    {
      id: '1',
      title: 'Riya & Arjun',
      date: '14 February 2026',
      photoCount: 4287
    },
    {
      id: '2',
      title: 'Neha & Sahil',
      date: '09 February 2026',
      photoCount: 3102
    }
  ])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNewEvent = () => {
    navigate('/admin/events/create')
  }

  const handleManageEvent = (eventId) => {
    navigate(`/admin/events/${eventId}`)
  }

  return (
    <div className="admin-dashboard">
      <Navbar userEmail={user?.email || 'admin@example.com'} onLogout={handleLogout} />
      
      <main className="admin-dashboard-content">
        <div className="container">
          <div className="admin-dashboard-header">
            <div className="admin-dashboard-header-left">
              <h1 className="admin-dashboard-title">MY EVENTS</h1>
              <div className="title-underline"></div>
            </div>
            <button 
              onClick={handleNewEvent}
              className="btn btn-primary"
            >
              + NEW EVENT
            </button>
          </div>

          <div className="events-list">
            {events.length > 0 ? (
              events.map(event => (
                <EventCard 
                  key={event.id}
                  event={event}
                  onManage={handleManageEvent}
                />
              ))
            ) : (
              <EmptyState 
                icon="📸"
                message="No events yet — create your first"
                actionText="+ NEW EVENT"
                onAction={handleNewEvent}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
