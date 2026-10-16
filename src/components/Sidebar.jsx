const items = ["Home", "TV show", "Movie", "Animation", "Most Watched"];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <h1>MovieBox</h1>
      {items.map((i) => (
        <button
          key={i}
          className={active === i ? "active" : ""}
          onClick={() => onSelect(i)}
        >
          {i}
        </button>
      ))}
    </aside>
  );
}