import '../styles/components.css'

function Button({ 
  children, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  const variantClass = `btn-${variant}`
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
