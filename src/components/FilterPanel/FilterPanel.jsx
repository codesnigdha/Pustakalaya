import { Filter, RotateCcw } from "lucide-react";

import "./FilterPanel.css";

function FilterPanel({
  categories = [],
  selectedCategory = "All",
  setSelectedCategory,
}) {
  const handleReset = () => {
    setSelectedCategory?.("All");
  };

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <div>
          <Filter size={17} />
          <h3>Filters</h3>
        </div>

        <button onClick={handleReset}>
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="filter-section">
        <h4>Category</h4>

        <div className="filter-options">
          <button
            className={selectedCategory === "All" ? "active" : ""}
            onClick={() => setSelectedCategory?.("All")}
          >
            All Books
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory?.(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default FilterPanel;
