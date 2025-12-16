import "../styling/SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search events by title, date, or price...",
}) {
  return (
    <div className="search-container">
      <label className="search-label">Search Events</label>
      <input
        type="text"
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
