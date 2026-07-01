import { DashboardLayout } from '../../layouts/DashboardLayout'

export default function Dashboard() {
  const openAiHealth = (event) => {
    event.preventDefault()
    window.history.pushState({}, '', '/ai')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <DashboardLayout>
      <section className="page-card">
        <h1>ICADHI Dashboard</h1>
        <p>Frontend shell is connected. Use the main root app for the complete operations workspace.</p>
        <p style={{ marginTop: '1rem' }}>
          <a href="/ai" onClick={openAiHealth}>Open AI Health Assistant</a>
        </p>
      </section>
    </DashboardLayout>
  )
}
