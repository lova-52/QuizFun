import React from 'react';

function FilterSidebar({ 
  sortOptions,
  selectedSort,
  setSelectedSort,
  searchTerm,
  setSearchTerm,
  resetFilters
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Bộ lọc</h3>
      
      {/* Tìm kiếm */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm quiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Sắp xếp */}
      <div className="mb-6">
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
    </div>
  );
}

export default FilterSidebar;