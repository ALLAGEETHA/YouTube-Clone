import './FilterButtons.css';

const FilterButtons = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="filter-buttons">
      {categories.map((category) => (
        <button
          key={category}
          className={`filter-button ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;

