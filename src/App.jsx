import { useState } from 'react'

const initialSignup = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const initialLogin = {
  email: '',
  password: '',
}

const orbitCards = [
  { id: '01', title: 'Identity sync', detail: 'Profiles, teams, and roles stay in one flow.' },
  { id: '02', title: 'Fast access', detail: 'Returning members land in the right workspace quickly.' },
  { id: '03', title: 'Human tone', detail: 'Friendly copy and clear validation reduce friction.' },
]

function App() {
  const [mode, setMode] = useState('signup')
  const [signupForm, setSignupForm] = useState(initialSignup)
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [message, setMessage] = useState({
    type: 'idle',
    text: 'Create an account or sign in to continue.',
  })

  const activeForm = mode === 'signup' ? signupForm : loginForm

  const updateSignupField = (event) => {
    const { name, value } = event.target
    setSignupForm((current) => ({ ...current, [name]: value }))
  }

  const updateLoginField = (event) => {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setMessage({
      type: 'idle',
      text:
        nextMode === 'signup'
          ? 'Create an account or sign in to continue.'
          : 'Welcome back. Enter your details to access your account.',
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (mode === 'signup') {
      const { name, email, password, confirmPassword } = signupForm

      if (!name || !email || !password || !confirmPassword) {
        setMessage({
          type: 'error',
          text: 'Please fill in every signup field before continuing.',
        })
        return
      }

      if (password.length < 8) {
        setMessage({
          type: 'error',
          text: 'Use at least 8 characters for a stronger password.',
        })
        return
      }

      if (password !== confirmPassword) {
        setMessage({
          type: 'error',
          text: 'Passwords do not match yet. Please check them again.',
        })
        return
      }

      setMessage({
        type: 'success',
        text: `Account created for ${name}. You can now sign in with ${email}.`,
      })
      setSignupForm(initialSignup)
      setMode('login')
      return
    }

    const { email, password } = loginForm

    if (!email || !password) {
      setMessage({
        type: 'error',
        text: 'Enter both email and password to sign in.',
      })
      return
    }

    setMessage({
      type: 'success',
      text: `Signed in successfully as ${email}.`,
    })
    setLoginForm(initialLogin)
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel--brand">
        <div className="brand-topbar">
          <div className="brand-badge">Aster Vault</div>
          <div className="signal-pill">Live access layer</div>
        </div>

        <div className="brand-copy">
          <p className="eyebrow">Designed for first impressions</p>
          <h1>Make account access feel like part of the product, not a side screen.</h1>
          <p className="lead">
            This version leans into a more cinematic, product-led layout with a
            stronger identity than a usual card-on-background login page.
          </p>
        </div>

        <div className="brand-orbit" aria-hidden="true">
          <div className="brand-orbit__ring brand-orbit__ring--outer" />
          <div className="brand-orbit__ring brand-orbit__ring--inner" />
          <div className="brand-orbit__core">
            <span>AUTH</span>
            <strong>Secure entry</strong>
          </div>
          <div className="orbit-chip orbit-chip--north">Encrypted sessions</div>
          <div className="orbit-chip orbit-chip--east">Realtime onboarding</div>
          <div className="orbit-chip orbit-chip--south">Mobile ready</div>
        </div>

        <div className="feature-card feature-card--stacked">
          <p className="feature-card__title">Inside this concept</p>
          <div className="orbit-grid">
            {orbitCards.map((item) => (
              <article key={item.id} className="orbit-card">
                <span>{item.id}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="auth-panel auth-panel--form">
        <div className="auth-card">
          <div className="auth-card__header">
            <p className="eyebrow">
              {mode === 'signup' ? 'Launch your space' : 'Welcome back'}
            </p>
            <h2>{mode === 'signup' ? 'Open your portal' : 'Resume your session'}</h2>
            <p className="subtle">
              {mode === 'signup'
                ? 'Claim your corner of the workspace with a quick setup.'
                : 'Step back into your dashboard without losing momentum.'}
            </p>
          </div>

          <div className="mode-switch" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === 'signup' ? 'is-active' : ''}
              onClick={() => switchMode('signup')}
            >
              Sign up
            </button>
            <button
              type="button"
              className={mode === 'login' ? 'is-active' : ''}
              onClick={() => switchMode('login')}
            >
              Login
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <>
                <label>
                  Full name
                  <input
                    type="text"
                    name="name"
                    placeholder="Aster explorer"
                    value={signupForm.name}
                    onChange={updateSignupField}
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={signupForm.email}
                    onChange={updateSignupField}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a strong passphrase"
                    value={signupForm.password}
                    onChange={updateSignupField}
                  />
                </label>
                <label>
                  Confirm password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat your passphrase"
                    value={signupForm.confirmPassword}
                    onChange={updateSignupField}
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={updateLoginField}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your passphrase"
                    value={loginForm.password}
                    onChange={updateLoginField}
                  />
                </label>
              </>
            )}

            <div className="form-row">
              <label className="checkbox">
                <input type="checkbox" defaultChecked={mode === 'login'} />
                <span>
                  {mode === 'signup' ? 'I agree to the terms' : 'Remember me'}
                </span>
              </label>
              {mode === 'login' ? (
                <button type="button" className="text-button">
                  Forgot password?
                </button>
              ) : (
                <span className="hint">Aim for 8+ characters with a memorable phrase.</span>
              )}
            </div>

            <button type="submit" className="submit-button">
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className={`status-banner status-banner--${message.type}`}>
            {message.text}
          </div>

          <p className="footer-note">
            {mode === 'signup'
              ? 'Already have an account?'
              : "Don't have an account yet?"}{' '}
            <button
              type="button"
              className="text-button"
              onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
            >
              {mode === 'signup' ? 'Login' : 'Create one'}
            </button>
          </p>

          <div className="form-preview">
            <span>Current input map</span>
            <code>{Object.keys(activeForm).join(' / ')}</code>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
