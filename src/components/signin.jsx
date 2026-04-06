import { useState } from 'react'
import './signin.css'
import { authAPI } from '../services/apiService'

export default function SignIn({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.login({
        email,
        password,
      })

      if (!response?.success) {
        setError(response?.message || 'Unable to sign in. Please try again.')
        setSuccess(false)
        return
      }

      setSuccess(true)
    } catch (apiError) {
      setError(apiError.message || 'Unable to sign in. Please try again.')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="signup-page">
        <div className="signup-card">
          <div className="signup-brand">
            <div className="signup-brand-mark">U</div>
            <div>
              <p className="signup-brand-name">Pantheon</p>
              <p className="signup-brand-sub">Member Portal</p>
            </div>
          </div>

          <div className="signup-success">
            <div className="signup-success-icon">OK</div>
            <h2 className="signup-success-title">Signed In!</h2>
            <p className="signup-success-sub">Welcome back to Pantheon.</p>
            <button className="signup-submit-btn" onClick={onBack} type="button">
              Go to Check-In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-brand">
          <div className="signup-brand-mark">U</div>
          <div>
            <p className="signup-brand-name">Pantheon</p>
            <p className="signup-brand-sub">Member Portal</p>
          </div>
        </div>

        <h1 className="signup-title">Sign In</h1>
        <p className="signup-subtitle">
          Sign in to access Pantheon&apos;s member portal
        </p>

        {error ? <div className="signup-error">{error}</div> : null}

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="signup-field">
            <label className="signup-label" htmlFor="signup-email">
              Email address
            </label>
            <div className="signup-input-wrap">
              <span className="signup-input-icon">@</span>
              <input
                id="signup-email"
                className="signup-input"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="signup-field">
            <label className="signup-label" htmlFor="signup-password">
              Password
            </label>
            <div className="signup-input-wrap">
              <span className="signup-input-icon">*</span>
              <input
                id="signup-password"
                className="signup-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                className="signup-eye-btn"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            className="signup-submit-btn"
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="signup-footer">
          Need to return?{' '}
          <button className="signup-link-btn" type="button" onClick={onBack}>
            Back to Check-In
          </button>
        </p>
      </div>
    </div>
  )
}
