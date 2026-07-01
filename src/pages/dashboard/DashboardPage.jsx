import { PageHero } from '../../components/shared/PageHero'
import { ProgressBar } from '../../components/shared/ProgressBar'
import { StatCard } from '../../components/shared/StatCard'

const congressStatus = [
  { name: 'Registration', value: 100 },
  { name: 'Check-in', value: 62 },
  { name: 'Lunch', value: 41 },
  { name: 'Workshop', value: 20 },
  { name: 'Certificates', value: 5 },
]

export function DashboardPage({ stats, schedule, auth, route }) {
  const quickActions = [
    { label: 'Open Scanner', target: 'qr-scanner' },
    { label: 'Review AI Health', target: 'ai-health' },
    { label: 'Participants', target: 'participants' },
  ]

  return (
    <>
      <PageHero
        eyebrow="Dashboard"
        title="Congress dashboard with live activity, analytics, schedule, and quick actions"
        description="Monitor registration, attendance, schedules, and daily operations from a polished control center built for the congress team."
        actions={
          <>
            <button type="button" onClick={auth.logout}>
              Logout
            </button>
            <button type="button" className="ghost-button" onClick={() => route.navigate('qr-scanner')}>
              Open Today&apos;s Event
            </button>
          </>
        }
      />

      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
          />
        ))}
      </section>

      <section className="two-column-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Congress status</span>
              <h3>Live progress monitor</h3>
            </div>
          </div>
          {congressStatus.map((item) => (
            <ProgressBar key={item.name} name={item.name} value={item.value} />
          ))}
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Schedule CSV</span>
              <h3>Today&apos;s timeline</h3>
            </div>
          </div>
          <div className="timeline">
            {schedule.map((row) => (
              <div key={`${row.time}-${row.event}`} className="timeline__item">
                <span className="timeline__dot" />
                <p>
                  {row.time} {row.event}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="three-column-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Live activity</span>
              <h3>Recent congress updates</h3>
            </div>
          </div>
          <ul className="plain-list">
            <li>09:25 Participant checked in at Registration Desk</li>
            <li>09:30 Opening ceremony hall reached 82% capacity</li>
            <li>09:36 Lunch token issue prepared for VIP group</li>
            <li>09:42 Speaker presentation uploaded successfully</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Notifications</span>
              <h3>Today&apos;s alerts</h3>
            </div>
          </div>
          <ul className="plain-list">
            <li>Workshop hall updated to Hall B</li>
            <li>Transport pickup delayed by 10 minutes</li>
            <li>Security requested additional volunteer support</li>
            <li>Medical desk marked one emergency case as closed</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Quick actions</span>
              <h3>Operations shortcuts</h3>
            </div>
          </div>
          <div className="chip-list">
            {quickActions.map((item) => (
              <button key={item.label} type="button" className="chip" onClick={() => route.navigate(item.target)}>
                {item.label}
              </button>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
