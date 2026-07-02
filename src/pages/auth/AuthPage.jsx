import { useState } from 'react'

export function AuthPage({ auth }) {
  const [organizerMode, setOrganizerMode] = useState('login')

  const setLoginRole = (role) => {
    auth.updateLoginField({ target: { name: 'role', value: role } })
    if (role === 'organizer') {
      setOrganizerMode('login')
    }
  }

  const isAdmin = auth.loginForm.role === 'admin'
  const isOrganizerLogin = auth.loginForm.role === 'organizer' && organizerMode === 'login'
  const isOrganizerSignup = auth.loginForm.role === 'organizer' && organizerMode === 'signup'

  return (
    <main className="access-shell">
      <nav className="access-nav" aria-label="Login navigation">
        <div className="access-brand">
          <span className="access-logo">I</span>
          <div>
            <strong>ICADHI 2026</strong>
            <span>International Congress on AI and Digital Health</span>
          </div>
        </div>
        <div className="access-nav__actions">
          <button
            type="button"
            className={isAdmin ? 'access-tab is-active access-tab--muted' : 'access-tab access-tab--muted'}
            onClick={() => setLoginRole('admin')}
          >
            Admin Login
          </button>
          <button
            type="button"
            className={!isAdmin ? 'access-tab is-active' : 'access-tab'}
            onClick={() => setLoginRole('organizer')}
          >
            Organizer Login or Signup
          </button>
        </div>
      </nav>

      <section className="access-grid">
        <div className="access-hero">
          <span className="eyebrow">International Congress on AI and Digital Health</span>
          <h1>Admin controlled organizer access.</h1>
          <p>Hello organizers!</p>
          <div className="access-info-grid">
            <article>
              <span>Secure Access</span>
              <strong>Admin Controlled</strong>
              <p>Every organizer account is verified before access is granted.</p>
            </article>
            <article>
              <span>Review Queue</span>
              <strong>Pending Requests</strong>
              <p>Organizer signup requests remain pending until approved by the administrator.</p>
            </article>
          </div>
        </div>

        <div className="access-panel">
          <div className="access-panel__header">
            <div>
              <span className="eyebrow">{isAdmin ? 'Administrator' : 'Internal Organizer'}</span>
              <h2>{isAdmin ? 'Admin login' : 'Organizer access request'}</h2>
            </div>
            <span className="access-badge">{isAdmin ? 'Secure Admin' : 'Stored Locally'}</span>
          </div>

          {!isAdmin && (
            <div className="access-switch" role="group" aria-label="Organizer access mode">
              <button
                type="button"
                className={isOrganizerLogin ? 'is-active' : ''}
                onClick={() => {
                  setLoginRole('organizer')
                  setOrganizerMode('login')
                }}
              >
                Organizer Login
              </button>
              <button
                type="button"
                className={isOrganizerSignup ? 'is-active' : ''}
                onClick={() => {
                  setLoginRole('organizer')
                  setOrganizerMode('signup')
                }}
              >
                Organizer Signup
              </button>
            </div>
          )}

          {(isAdmin || isOrganizerLogin) && (
            <form className="access-form" onSubmit={auth.handleLogin}>
              <label>
                {isAdmin ? 'Admin email' : 'Organizer email'}
                <input
                  type="email"
                  name="email"
                  value={auth.loginForm.email}
                  onChange={auth.updateLoginField}
                  placeholder={isAdmin ? auth.adminCredentials.email : 'organizer@icadhi.org'}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={auth.loginForm.password}
                  onChange={auth.updateLoginField}
                  placeholder={isAdmin ? 'Enter admin password' : 'Enter organizer password'}
                />
              </label>
              <button type="submit" className="access-submit">
                {isAdmin ? 'Sign in as admin' : 'Sign in as organizer'}
              </button>
            </form>
          )}

          {isOrganizerSignup && (
            <form className="access-form access-form--signup" onSubmit={auth.handleSignup}>
              <label>
                Full name
                <input
                  type="text"
                  name="name"
                  value={auth.signupForm.name}
                  onChange={auth.updateSignupField}
                  placeholder="Organizer name"
                />
              </label>
              <label>
                Institution
                <input
                  type="text"
                  name="institution"
                  value={auth.signupForm.institution}
                  onChange={auth.updateSignupField}
                  placeholder="Institution"
                />
              </label>
              <label>
                Phone
                <input
                  type="text"
                  name="phone"
                  value={auth.signupForm.phone}
                  onChange={auth.updateSignupField}
                  placeholder="+8801..."
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={auth.signupForm.email}
                  onChange={auth.updateSignupField}
                  placeholder="Organizer email"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={auth.signupForm.password}
                  onChange={auth.updateSignupField}
                  placeholder="Create password"
                />
              </label>
              <button type="submit" className="access-submit">
                Submit organizer request
              </button>
            </form>
          )}

          <div className="access-message">{auth.message}</div>
        </div>
      </section>
    </main>
  )
}
