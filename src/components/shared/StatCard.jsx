export function StatCard({ label, value, tone }) {
  return (
    <article className={`stat-card stat-card--${tone || 'blue'}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  )
}
