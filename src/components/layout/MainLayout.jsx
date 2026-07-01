import { useState } from 'react'

function Sidebar({ routes, route, auth, dataStatus }) {
  const visibleRoutes = routes.filter((item) => {
    if (item.key === 'auth') {
      return true
    }

    if (!auth.currentUser) {
      return false
    }

    if (item.scope === 'admin') {
      return auth.isAdmin
    }

    if (item.scope === 'organizer') {
      return auth.isOrganizer || auth.isAdmin
    }

    return true
  })

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-badge">ICADHI</div>
        <p>Congress 2026</p>
        <h1>Management System</h1>
        <span>Secure operations platform for attendees, speakers, staff, and medical teams.</span>
      </div>

      <div className="sidebar__block">
        <p className="sidebar__label">Workspace</p>
        <nav className="nav-grid">
          {visibleRoutes.map((item) => (
            <button
              key={item.key}
              type="button"
              className={route.currentRoute === item.key ? 'nav-link is-active' : 'nav-link'}
              onClick={() => route.navigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar__block">
        <p className="sidebar__label">Quick access</p>
        <div className="link-stack">
          <button type="button" className="nav-link" onClick={() => route.navigate('dashboard')}>Operations</button>
          <button type="button" className="nav-link" onClick={() => route.navigate('ai-health')}>Medical AI</button>
          <button type="button" className="nav-link" onClick={() => route.navigate('qr-scanner')}>Check-in</button>
        </div>
      </div>

      <div className="sidebar__block">
        <p className="sidebar__label">System health</p>
        <div className="status-stack">
          <span>Registration: {dataStatus.stats}</span>
          <span>Schedule: {dataStatus.schedule}</span>
          <span>Organizers: {dataStatus.organizers}</span>
        </div>
      </div>

      <div className="sidebar__footer">
        <p>Current user</p>
        <span>
          {auth.currentUser
            ? `${auth.currentUser.name} (${auth.currentUser.role})`
            : 'No user logged in'}
        </span>
        <div className="sidebar__actions">
          {auth.currentUser ? (
            <button type="button" className="nav-link sidebar__action" onClick={auth.logout}>
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="nav-link sidebar__action"
              onClick={() => route.navigate('auth')}
            >
              Open Login
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

export function MainLayout({ children, routes, route, auth, dataStatus }) {
  const [topbarMessage, setTopbarMessage] = useState('System ready')
  const [themeMode, setThemeMode] = useState('Default')
  const [searchQuery, setSearchQuery] = useState('')

  const searchableRoutes = {
    abstract: 'abstracts',
    abstracts: 'abstracts',
    accommodation: 'accommodation',
    admin: 'admin',
    ai: 'ai-health',
    audit: 'audit',
    badge: 'badge',
    certificate: 'certificates',
    certificates: 'certificates',
    checkin: 'qr-scanner',
    finance: 'finance',
    food: 'food',
    medical: 'medical',
    notification: 'notifications',
    notifications: 'notifications',
    participant: 'participants',
    participants: 'participants',
    report: 'reports',
    reports: 'reports',
    scanner: 'qr-scanner',
    security: 'security',
    session: 'sessions',
    sessions: 'sessions',
    speaker: 'speakers',
    speakers: 'speakers',
    sponsor: 'sponsors',
    sponsors: 'sponsors',
    transport: 'transport',
    venue: 'venue-map',
    volunteer: 'volunteers',
    volunteers: 'volunteers',
    workshop: 'workshops',
    workshops: 'workshops',
  }

  const showNotifications = async () => {
    setTopbarMessage('Loading notifications...')

    try {
      const response = await fetch('/api/notifications')
      const data = await response.json().catch(() => ({}))
      const count = Array.isArray(data.data) ? data.data.length : 0
      setTopbarMessage(`${count} notifications loaded from backend.`)
    } catch {
      setTopbarMessage('Backend not reachable. Start backend with npm.cmd run dev.')
    }
  }

  const toggleTheme = () => {
    const nextTheme = themeMode === 'Default' ? 'Focus' : 'Default'
    setThemeMode(nextTheme)
    setTopbarMessage(`${nextTheme} theme response applied.`)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const normalized = searchQuery.trim().toLowerCase()
    const target = searchableRoutes[normalized]

    if (!target) {
      setTopbarMessage(`No module found for "${searchQuery}". Try participants, food, badge, reports, or scanner.`)
      return
    }

    route.navigate(target)
    setTopbarMessage(`Opened ${target.replace('-', ' ')} from search.`)
    setSearchQuery('')
  }

  return (
    <main className="app-shell">
      <Sidebar routes={routes} route={route} auth={auth} dataStatus={dataStatus} />
      <section className="content">
        <header className="topbar">
          <div className="topbar__brand">
            <strong>ICADHI Congress Control Center</strong>
            <span>Unified operations hub for the full event lifecycle</span>
          </div>
          <form className="topbar__search" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search participants, sessions, reports..."
            />
            <button type="submit" className="topbar-pill">Go</button>
          </form>
          <div className="topbar__meta">
            <button type="button" className="topbar-pill" onClick={showNotifications}>
              Notifications
            </button>
            <button type="button" className="topbar-pill" onClick={toggleTheme}>
              {themeMode} Theme
            </button>
            <div className="topbar-profile">
              <strong>{auth.currentUser ? auth.currentUser.name : 'Guest User'}</strong>
              <span>{auth.currentUser ? auth.currentUser.role : 'Authentication required'}</span>
            </div>
          </div>
        </header>
        <div className="topbar-feedback">{topbarMessage}</div>
        <div className="content-layer">{children}</div>
      </section>
    </main>
  )
}
