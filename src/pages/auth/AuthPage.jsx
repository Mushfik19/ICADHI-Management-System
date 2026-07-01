export function AuthPage({ auth }) {
  return (
    <>
      <header className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Authentication route</span>
          <h2>Secure admin login and organizer approval flow</h2>
          <p>
            Create an organizer account, then let the admin approve it before you can access protected congress operations.
          </p>
          <p className="auth-helper">
            Demo admin account: <strong>{auth.adminCredentials.email}</strong>
          </p>
        </div>

        <div className="auth-panel">
          <div className="split-grid">
            <form className="auth-form" onSubmit={auth.handleLogin}>
              <span className="eyebrow">Login</span>
              <label>
                Login type
                <select
                  name="role"
                  value={auth.loginForm.role}
                  onChange={auth.updateLoginField}
                >
                  <option value="admin">Admin</option>
                  <option value="organizer">Organizer</option>
                </select>
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={auth.loginForm.email}
                  onChange={auth.updateLoginField}
                  placeholder="Enter email"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={auth.loginForm.password}
                  onChange={auth.updateLoginField}
                  placeholder="Enter password"
                />
              </label>
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>

            <form className="auth-form" onSubmit={auth.handleSignup}>
              <span className="eyebrow">Organizer signup</span>
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
              <button type="submit" className="submit-button">
                Sign up for approval
              </button>
            </form>
          </div>

          <div className="status-banner">{auth.message}</div>
        </div>
      </header>
      <section className="auth-visual">
        <div className="auth-visual__card">
          <span className="eyebrow">Authentication flow</span>
          <h3>Secure login, approval flow, and access control</h3>
          <p>
            The authentication experience is the secure gateway to the entire ICADHI congress management platform.
          </p>
          <div className="chip-list">
            {['Login', 'Forgot Password', 'Reset Password', 'OTP Verification', 'Create New Password'].map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
