import '../styles/components.css'

function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  autoComplete,
  ...props
}) {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        {...props}
      />
      {error && (
        <span className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
