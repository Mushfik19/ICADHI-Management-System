export function ProgressBar({ name, value }) {
  return (
    <div className="progress-row">
      <div className="progress-meta">
        <span>{name}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
