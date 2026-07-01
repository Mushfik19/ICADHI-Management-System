import { useState } from 'react'
import { ChipList } from '../../components/shared/ChipList'
import { PageHero } from '../../components/shared/PageHero'

const organizerModules = [
  'Registration Desk',
  'Participant Check-in',
  'Badge Printing',
  'Session Support',
  'Workshop Attendance',
  'Announcements',
  'Accommodation Follow-up',
  'Transport Coordination',
]

export function OrganizerPage({ auth }) {
  const [organizerMessage, setOrganizerMessage] = useState('Organizer workspace ready')

  const handleOrganizerAction = async (item) => {
    setOrganizerMessage(`${item} request sent...`)
    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'organizer',
        action: item,
        requestedBy: auth.currentUser?.name || 'Organizer',
        status: 'Recorded',
      }),
    }).catch(() => {})
    setOrganizerMessage(`${item} action recorded for organizer operations.`)
  }

  return (
    <>
      <PageHero
        eyebrow="Organizer route"
        title="Organizer-only operational page"
        description="Access the organizer workspace for attendee support, check-in coordination, and day-of-event operations."
      />

      <section className="two-column-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Allowed modules</span>
              <h3>Organizer can see these areas</h3>
            </div>
          </div>
          <ChipList items={organizerModules} onItemClick={handleOrganizerAction} />
          <div className="status-banner">{organizerMessage}</div>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Access status</span>
              <h3>Current organizer visibility rules</h3>
            </div>
          </div>
          <ChipList
            items={
              auth.isOrganizer
                ? ['Organizer approved', 'Login active', 'QR access enabled', 'Admin-only pages hidden']
                : ['Please log in as organizer', 'Admin approval required before access']
            }
          />
        </article>
      </section>
    </>
  )
}
