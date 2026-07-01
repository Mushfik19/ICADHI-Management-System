export function ChipList({ items, onItemClick }) {
  return (
    <div className="chip-list">
      {items.map((item) => (
        onItemClick ? (
          <button key={item} type="button" className="chip" onClick={() => onItemClick(item)}>
            {item}
          </button>
        ) : (
          <span key={item} className="chip">
            {item}
          </span>
        )
      ))}
    </div>
  )
}
