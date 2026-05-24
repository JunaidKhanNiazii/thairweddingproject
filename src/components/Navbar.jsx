import '../styles/components.css'

function Navbar({ userEmail, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img 
            src="/logo.png" 
            alt="Anmol Lamhe Photography" 
            className="navbar-logo-image"
          />
        </div>
        
        <div className="navbar-actions">
          <span className="navbar-email">{userEmail}</span>
          <button 
            onClick={onLogout}
            className="btn btn-ghost navbar-logout"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
