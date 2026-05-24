import '../styles/components.css'

function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClass = size === 'small' ? 'spinner-small' : ''
  
  return (
    <div 
      className={`spinner ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
