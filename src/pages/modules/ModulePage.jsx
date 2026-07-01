import { useState } from 'react'
import { ChipList } from '../../components/shared/ChipList'
import { PageHero } from '../../components/shared/PageHero'

export function ModulePage({ page, auth, pageKey }) {
  const [statusMessage, setStatusMessage] = useState('Ready to review')
  const [actionRows, setActionRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const endpointMap = {
    abstracts: '/api/abstracts',
    accommodation: '/api/accommodation',
    'ai-analytics': '/api/ai-analytics',
    badge: '/api/badges',
    certificates: '/api/certificates',
    exhibition: '/api/exhibition',
    finance: '/api/finance',
    food: '/api/food',
    'live-monitor': '/api/live-monitor',
    medical: '/api/medical',
    notifications: '/api/notifications',
    participants: '/api/participants',
    profile: '/api/profile',
    reports: '/api/reports',
    reviewers: '/api/reviews',
    roles: '/api/roles',
    security: '/api/security',
    sessions: '/api/sessions',
    settings: '/api/settings',
    speakers: '/api/speakers',
    sponsors: '/api/sponsors',
    transport: '/api/transport',
    'venue-map': '/api/venue',
    volunteers: '/api/volunteers',
    workshops: '/api/workshops',
  }

  const createPayloadMap = {
    participants: () => ({
      name: 'New Delegate',
      email: `delegate-${Date.now()}@icadhi.org`,
      country: 'Bangladesh',
      institution: 'ICADHI Registration Desk',
      category: 'Participant',
      status: 'Registered',
    }),
    badge: () => ({
      participant: 'New Delegate',
      type: 'Participant',
      color: 'Blue',
      email: `delegate-${Date.now()}@icadhi.org`,
      printStatus: 'Ready to print',
      status: 'Generated',
    }),
    speakers: () => ({
      name: 'Dr. New Speaker',
      topic: 'Digital Health Innovation',
      institution: 'ICADHI Scientific Committee',
      country: 'Bangladesh',
      status: 'Invited',
    }),
    sessions: () => ({
      title: 'New Scientific Session',
      hall: 'Hall A',
      speaker: 'Dr. New Speaker',
      capacity: 120,
      status: 'Scheduled',
    }),
    workshops: () => ({
      title: 'New Hands-on Workshop',
      instructor: 'Workshop Team',
      capacity: 40,
      registered: 0,
      status: 'Open',
    }),
    abstracts: () => ({
      title: 'New Abstract Submission',
      author: 'Research Delegate',
      reviewer: 'Unassigned',
      score: 'Pending',
      status: 'Submitted',
    }),
    reviewers: () => ({
      paper: 'New Abstract Submission',
      reviewer: 'Dr. Reviewer',
      decision: 'Pending',
      score: 'Not scored',
      status: 'Assigned',
    }),
    reports: () => ({
      title: 'Congress Operations Report',
      format: 'PDF',
      generatedBy: auth.currentUser?.name || 'Guest',
      status: 'Ready',
    }),
    food: () => ({
      meal: 'Dinner',
      served: 0,
      remaining: 200,
      pending: 200,
      status: 'Scheduled',
    }),
    accommodation: () => ({
      guest: 'New Delegate',
      hotel: 'Grand Hall Inn',
      room: 'Pending',
      arrival: 'Today',
      status: 'Assigned',
    }),
    transport: () => ({
      vehicle: 'Microbus 02',
      driver: 'Dispatch Team',
      pickup: 'Airport',
      drop: 'Venue',
      status: 'Assigned',
    }),
    sponsors: () => ({
      company: 'New Sponsor',
      tier: 'Bronze',
      booth: 'Pending',
      invoice: 'Draft',
      status: 'Lead created',
    }),
    exhibition: () => ({
      booth: 'C1',
      company: 'New Exhibitor',
      representative: 'Expo Desk',
      visitors: 0,
      status: 'Reserved',
    }),
    finance: () => ({
      label: 'New transaction',
      type: 'Income',
      amount: 0,
      invoice: `INV-${Date.now()}`,
      status: 'Draft',
    }),
    volunteers: () => ({
      name: 'New Volunteer',
      shift: 'Morning',
      task: 'Registration support',
      phone: '+8801...',
      status: 'Assigned',
    }),
    notifications: () => ({
      title: 'New broadcast message',
      channel: 'System',
      audience: 'All delegates',
      delivery: 'Queued',
      status: 'Ready',
    }),
    medical: () => ({
      patient: 'New Case',
      issue: 'On-site support',
      severity: 'Low',
      doctor: 'Medical Desk',
      status: 'Open',
    }),
    security: () => ({
      incident: 'New security note',
      severity: 'Low',
      location: 'Main lobby',
      assignedTo: 'Security Desk',
      status: 'Open',
    }),
    certificates: () => ({
      recipient: 'New Delegate',
      type: 'Attendance',
      email: `delegate-${Date.now()}@icadhi.org`,
      delivery: 'Email queued',
      status: 'Generated',
    }),
    settings: () => ({
      key: 'eventMode',
      value: 'Live',
      updatedBy: auth.currentUser?.name || 'Guest',
      status: 'Saved',
    }),
    profile: () => ({
      name: auth.currentUser?.name || 'Guest User',
      role: auth.currentUser?.role || 'guest',
      action: 'Profile review',
      status: 'Updated',
    }),
    audit: () => ({
      user: auth.currentUser?.name || 'Guest',
      action: 'Audit export requested',
      ip: 'Local session',
      status: 'Recorded',
    }),
    'ai-analytics': () => ({
      metric: 'No-show prediction',
      value: '12%',
      confidence: 'Medium',
      status: 'Calculated',
    }),
    'live-monitor': () => ({
      zone: 'Main Lobby',
      crowd: 'Medium',
      service: 'Scanner',
      status: 'Live',
    }),
    'venue-map': () => ({
      area: 'Hall B',
      route: 'Registration desk to Hall B',
      accessibility: 'Available',
      status: 'Open',
    }),
    roles: () => ({
      name: 'event-staff',
      permissions: 'Read operations',
      assignedBy: auth.currentUser?.name || 'Guest',
      status: 'Prepared',
    }),
  }

  const createPayload = () => ({
    ...(createPayloadMap[pageKey]?.() || {
      title: page.quickAction,
      status: 'Created',
    }),
    module: pageKey,
    requestedBy: auth.currentUser?.name || 'Guest',
    createdAt: new Date().toLocaleString(),
  })

  const normalizeRows = (payload) => {
    if (Array.isArray(payload?.data)) {
      return payload.data
    }

    if (payload?.data && typeof payload.data === 'object') {
      return [payload.data]
    }

    return []
  }

  const loadModuleData = async (mode = 'list') => {
    const endpoint = endpointMap[pageKey] || `/api/${pageKey}`
    setIsLoading(true)
    setStatusMessage(`${page.quickAction} request sent...`)

    try {
      const actionPayload = createPayload()
      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'GET',
        headers: mode === 'create' ? { 'Content-Type': 'application/json' } : undefined,
        body: mode === 'create' ? JSON.stringify(actionPayload) : undefined,
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Request failed.')
      }

      let rows = normalizeRows(data)

      if (mode === 'create') {
        const listResponse = await fetch(endpoint)
        const listData = await listResponse.json().catch(() => data)
        rows = normalizeRows(listData)
      }

      setActionRows(rows)
      setStatusMessage(`${data.message || 'Backend response received.'} ${rows.length} record${rows.length === 1 ? '' : 's'} shown.`)

      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...actionPayload,
          action: mode === 'create' ? page.quickAction : `Loaded ${page.eyebrow}`,
          status: 'Success',
          details: {
            endpoint,
            rows: rows.length,
          },
        }),
      }).catch(() => {})
    } catch (error) {
      setActionRows([])
      setStatusMessage(error.message || 'Backend not reachable. Start backend and frontend together.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = () => loadModuleData('create')
  const handleChipAction = (item) => {
    setStatusMessage(`${item} selected. Loading ${page.eyebrow.toLowerCase()} data...`)
    loadModuleData('list')
  }

  const tableColumns = [...new Set(actionRows.flatMap((row) => Object.keys(row || {})))].slice(0, 8)

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        actions={
          auth.currentUser ? (
            <>
              <button type="button" onClick={auth.logout}>
                Logout
              </button>
              <button type="button" className="ghost-button" onClick={handleQuickAction} disabled={isLoading}>
                {isLoading ? 'Working...' : page.quickAction}
              </button>
            </>
          ) : null
        }
      />

      <section className="module-overview-grid">
        <div className="status-banner">{statusMessage}</div>
        {actionRows.length > 0 ? (
          <article className="panel module-response-panel">
            <div className="panel__header">
              <div>
                <span className="eyebrow">Backend response</span>
                <h3>{page.eyebrow} data</h3>
              </div>
              <span className="status-pill">{actionRows.length} rows</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {tableColumns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {actionRows.map((row, index) => (
                    <tr key={row.id || `${pageKey}-${index}`}>
                      {tableColumns.map((column) => (
                        <td key={column}>{String(row[column] ?? '-')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : null}
        {page.sections.map((section) => (
          <article key={section.title} className="panel">
            <div className="panel__header">
              <div>
                <span className="eyebrow">{section.eyebrow}</span>
                <h3>{section.title}</h3>
              </div>
            </div>
            {section.type === 'chips' ? <ChipList items={section.items} onItemClick={handleChipAction} /> : null}
            {section.type === 'list' ? (
              <ul className="plain-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
    </>
  )
}
