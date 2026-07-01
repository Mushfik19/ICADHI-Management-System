import { useState } from 'react'
import { ChipList } from '../../components/shared/ChipList'
import { PageHero } from '../../components/shared/PageHero'

const qrFeatures = [
  'Live scan frame',
  'Duplicate detection',
  'Participant verification',
  'Attendance save',
  'Badge print trigger',
]

export function QrScannerPage() {
  const [scannerResult, setScannerResult] = useState('No QR scanned yet.')

  const recordScan = async () => {
    const scan = {
      code: 'QR-ICADHI-2026-CHK-1042',
      participant: 'New Delegate',
      gate: 'Main Entry',
      status: 'Verified',
      scannedAt: new Date().toLocaleString(),
    }

    setScannerResult(`${scan.code} scanned. ${scan.participant} verified for venue entry.`)

    await fetch('/api/scanner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scan),
    }).catch(() => {})

    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'scanner',
        action: 'Simulate scan',
        requestedBy: 'Scanner Desk',
        status: 'Verified',
        details: scan,
      }),
    }).catch(() => {})
  }

  const handleWorkflowAction = async (item) => {
    const messages = {
      'Live scan frame': 'Camera scan frame is active and ready.',
      'Duplicate detection': 'Duplicate scan check completed. No duplicate found.',
      'Participant verification': 'Participant verification passed.',
      'Attendance save': 'Attendance save request sent to backend.',
      'Badge print trigger': 'Badge print trigger queued for this participant.',
    }
    setScannerResult(messages[item] || `${item} completed.`)

    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'scanner',
        action: item,
        requestedBy: 'Scanner Desk',
        status: 'Recorded',
      }),
    }).catch(() => {})
  }

  return (
    <>
      <PageHero
        eyebrow="QR scanner route"
        title="Dedicated QR scanner page"
        description="Run rapid attendee verification, capture check-ins, and keep entry flow accurate across the venue."
      />

      <section className="two-column-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Scanner</span>
              <h3>Check-in scan area</h3>
            </div>
          </div>
          <div className="scanner-box">
            <div className="scanner-frame">
              <div className="scanner-line" />
            </div>
            <p>{scannerResult}</p>
            <button
              type="button"
              className="submit-button"
              onClick={recordScan}
            >
              Simulate scan
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="eyebrow">Functions</span>
              <h3>QR workflow</h3>
            </div>
          </div>
          <ChipList items={qrFeatures} onItemClick={handleWorkflowAction} />
        </article>
      </section>
    </>
  )
}
