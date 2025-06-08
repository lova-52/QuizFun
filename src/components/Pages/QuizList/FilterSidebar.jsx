import React from 'react';

function FilterSidebar({ 
  sortOptions,
  selectedSort,
  setSelectedSort
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Bộ lọc</h3>
      
      {/* Sắp xếp */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Sắp xếp theo</h4>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Nút reset */}
      <button 
        onClick={() => {
          setSelectedSort('popular');
        }}
        className="mt-6 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
      >
        Đặt lại bộ lọc
      </button>
    </div>
  );
}

export default FilterSidebar;