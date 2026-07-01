import { useState } from 'react'
import { PageHero } from '../../components/shared/PageHero'

function analyzePrompt(prompt = '') {
  const normalized = String(prompt || '').trim().toLowerCase()
  const flags = []

  if (/(fever|cough|pain|fatigue|dizzy|breath|wound)/i.test(normalized)) {
    flags.push('Symptom cluster detected')
  }

  if (/(xray|scan|image|radiology|mri|ecg)/i.test(normalized)) {
    flags.push('Imaging context detected')
  }

  if (/(emergency|severe|chest|stroke)/i.test(normalized)) {
    flags.push('Urgent clinical review recommended')
  }

  return {
    summary:
      flags.length > 0
        ? `The note suggests ${flags.join(' and ')}.`
        : 'The note is general and appears non-urgent.',
    flags,
    action:
      flags.includes('Urgent clinical review recommended')
        ? 'Escalate to the medical team immediately.'
        : 'Continue routine monitoring and consult a clinician if symptoms worsen.',
  }
}

export function AiHealthPage({ auth }) {
  const [prompt, setPrompt] = useState('Fever, mild cough, and fatigue for 2 days')
  const [analysis, setAnalysis] = useState(analyzePrompt('Fever, mild cough, and fatigue for 2 days'))
  const [status, setStatus] = useState('Ready to review')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    setStatus('Reviewing note...')

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Analysis request failed.')
      }

      setAnalysis({
        summary: data.analysis?.summary || 'No summary available.',
        flags: data.analysis?.flags || [],
        action: data.analysis?.recommendedAction || 'Continue monitoring.',
      })
      setStatus('Analysis complete')
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to reach the AI service.')
      setStatus('Analysis failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="AI Digital Health"
        title="Interactive health intelligence for symptom review and imaging triage"
        description="This module provides a working AI-style review workflow for symptom notes and imaging context."
        actions={
          auth.currentUser ? (
            <>
              <button type="button" onClick={auth.logout}>Logout</button>
              <button type="button" className="ghost-button" onClick={() => (window.location.hash = '/medical')}>Open patient queue</button>
            </>
          ) : null
        }
      />

      <section className="two-column-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Review input</span>
              <h3>Clinical note assistant</h3>
            </div>
            <span className="status-pill">{status}</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="health-prompt">Describe the patient note or imaging request</label>
            <textarea
              id="health-prompt"
              rows="6"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: Fever, mild cough, chest pain, and imaging request"
            />
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Reviewing...' : 'Run review'}
            </button>
          </form>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">AI outcome</span>
              <h3>Suggested response</h3>
            </div>
          </div>
          {error ? <div className="status-banner">{error}</div> : null}
          <div className="summary-box">
            <strong>{analysis.summary}</strong>
            <span>{analysis.action}</span>
          </div>
          <div className="section-block">
            <div className="chip-list">
              {analysis.flags.map((flag) => (
                <span key={flag} className="chip">{flag}</span>
              ))}
            </div>
          </div>
        </article>
      </section>
    </>
  )
}
