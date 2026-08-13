import { Search, X } from "lucide-react";

import "./SearchBar.css";

function SearchBar({ value = "", onChange, placeholder = "Search books..." }) {
  const clearSearch = () => {
    onChange?.({ target: { value: "" } });
  };

  return (
    <div className="search-bar">
      <Search size={17} />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {value && (
        <button
          className="search-clear"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
