import '../styles/components.css'

function EmptyState({ 
  icon = '📸', 
  message = 'No items found', 
  actionText, 
  onAction 
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-text">{message}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
