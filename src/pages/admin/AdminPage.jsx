import { useState } from 'react'
import { ChipList } from '../../components/shared/ChipList'
import { PageHero } from '../../components/shared/PageHero'

const sensitiveModules = [
  'Finance Reports',
  'Audit Log',
  'API Keys',
  'Refund Approval',
  'Reviewer Assignment',
  'Security Incidents',
]

export function AdminPage({ auth }) {
  const [adminMessage, setAdminMessage] = useState('Admin controls ready')

  const handleSensitiveAction = async (item) => {
    setAdminMessage(`${item} request sent to backend...`)
    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'admin',
        action: item,
        requestedBy: auth.currentUser?.name || 'Admin',
        status: 'Recorded',
      }),
    }).catch(() => {})
    setAdminMessage(`${item} action recorded. Open Audit Log to review system activity.`)
  }

  return (
    <>
      <PageHero
        eyebrow="Admin route"
        title="Sensitive admin controls"
        description="Manage approvals, governance, and sensitive system controls from a dedicated admin workspace."
      />

      <section className="two-column-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Sensitive modules</span>
              <h3>Admin-only visibility</h3>
            </div>
          </div>
          <ChipList items={sensitiveModules} onItemClick={handleSensitiveAction} />
          <div className="status-banner">{adminMessage}</div>
        </article>

        <article className="panel">
          <div className="panel__header panel__header--split">
            <div>
              <span className="eyebrow">Approval summary</span>
              <h3>Organizer account queue</h3>
            </div>
            <span className="status-pill">Admin only</span>
          </div>
          <div className="approval-summary">
            <div className="summary-box">
              <strong>{auth.pendingOrganizers.length}</strong>
              <span>Pending</span>
            </div>
            <div className="summary-box">
              <strong>{auth.approvedOrganizers.length}</strong>
              <span>Approved</span>
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel__header panel__header--split">
          <div>
            <span className="eyebrow">Approval queue</span>
            <h3>CSV-seeded organizer records</h3>
          </div>
          {!auth.isAdmin ? <span className="status-pill">Login as admin to approve</span> : null}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Institution</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {auth.organizers.map((organizer) => (
                <tr key={organizer.id}>
                  <td>{organizer.name}</td>
                  <td>{organizer.institution}</td>
                  <td>{organizer.phone}</td>
                  <td>{organizer.email}</td>
                  <td>{organizer.status}</td>
                  <td>
                    {auth.isAdmin && organizer.status === 'pending' ? (
                      <button
                        type="button"
                        className="table-button"
                        onClick={() => auth.approveOrganizer(organizer.id)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="table-badge">
                        {organizer.status === 'approved' ? 'Approved' : 'Locked'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
