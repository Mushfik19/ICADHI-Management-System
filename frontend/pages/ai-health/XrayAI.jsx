import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { httpGet, httpPost } from '../../services/http.service'

export default function XrayAI() {
  const [prompt, setPrompt] = useState('Fever, mild cough, and fatigue for 2 days')
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHealth() {
      try {
        const data = await httpGet('/api/ai/health')
        setHealth(data)
      } catch (err) {
        setError(err.message)
      }
    }

    loadHealth()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await httpPost('/api/ai/analyze', { prompt })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <section className="page-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
        <h1>AI Health Assistant</h1>
        <p>Send a symptom note or X-ray request and receive a simple AI-style analysis response from the backend.</p>

        {health ? (
          <p style={{ color: '#0f766e' }}>
            Backend status: {health.status} · {health.message}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          <label htmlFor="prompt">Describe the condition or request</label>
          <textarea
            id="prompt"
            rows="5"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
          />
          <button type="submit" disabled={loading} style={{ width: 'fit-content', padding: '0.7rem 1rem' }}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error ? <p role="alert" style={{ color: '#b91c1c', marginTop: '1rem' }}>{error}</p> : null}

        {result ? (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
            <h2>Analysis result</h2>
            <p>{result.analysis?.summary}</p>
            <p><strong>Recommended action:</strong> {result.analysis?.recommendedAction}</p>
            {result.analysis?.flags?.length ? (
              <ul>
                {result.analysis.flags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>
    </DashboardLayout>
  )
}