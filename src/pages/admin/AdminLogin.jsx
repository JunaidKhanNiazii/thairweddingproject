import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/components.css'
import './AdminLogin.css'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

function AdminLogin() {
  const { login, user, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  if (user) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setError('Invalid email or password.')
      } else {
        setError('Something went wrong. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setResetSent(false)
    setResetLoading(true)
    try {
      await resetPassword(ADMIN_EMAIL)
      setResetSent(true)
    } catch {
      setError('Failed to send reset email. Try again.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* Logo */}
        <div className="admin-login-logo">
          <img 
            src="/logo3.png" 
            alt="Anmol Lamhe Photography" 
            className="logo-image"
          />
        </div>

        {/* Title */}
        <h1 className="admin-login-title brand-title">ADMIN LOGIN</h1>
        <div className="divider-short"></div>

        {/* Login Form */}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="admin@anmollamhe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Success Message */}
          {resetSent && (
            <div className="success-message" role="alert">
              <p><strong>Reset link sent to your email.</strong></p>
              <p>Check your inbox at <strong>{ADMIN_EMAIL}</strong>.</p>
              <p>If not in inbox, please check your <strong>Spam</strong> folder.</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner spinner-small"></span>
                LOGGING IN...
              </>
            ) : (
              'LOG IN'
            )}
          </button>

          {/* Forgot Password Link */}
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="forgot-password-link btn-ghost"
          >
            {resetLoading ? 'Sending...' : 'Forgot password?'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
