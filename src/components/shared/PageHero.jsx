export function PageHero({ eyebrow, title, description, actions }) {
  return (
    <header className="hero-card">
      <div className="hero-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
    </header>
  )
}
