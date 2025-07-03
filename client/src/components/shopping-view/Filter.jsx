import React, { useState } from "react";

function ProductFilter() {
  const filterOptions = {
    category: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "footwear", label: "Footwear" },
      { id: "accessories", label: "Accessories" },
    ],
    brand: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "zara", label: "Zara" },
    ],
  };

  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
  });

  const handleCheckboxChange = (type, id) => {
    setSelectedFilters((prev) => {
      const isSelected = prev[type].includes(id);
      return {
        ...prev,
        [type]: isSelected
          ? prev[type].filter((item) => item !== id)
          : [...prev[type], id],
      };
    });
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white w-full max-w-xs">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
        {filterOptions.category.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 text-sm text-gray-600 mb-1"
          >
            <input
              type="checkbox"
              checked={selectedFilters.category.includes(item.id)}
              onChange={() => handleCheckboxChange("category", item.id)}
            />
            {item.label}
          </label>
        ))}
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Brand</h3>
        {filterOptions.brand.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 text-sm text-gray-600 mb-1"
          >
            <input
              type="checkbox"
              checked={selectedFilters.brand.includes(item.id)}
              onChange={() => handleCheckboxChange("brand", item.id)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
