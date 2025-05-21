import React from 'react';

function FilterSidebar({ 
  difficulties, 
  selectedDifficulty, 
  setSelectedDifficulty,
  sortOptions,
  selectedSort,
  setSelectedSort
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Bộ lọc</h3>
      
      {/* Độ khó */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Độ khó</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="all-difficulty"
              type="radio"
              name="difficulty"
              checked={selectedDifficulty === 'all'}
              onChange={() => setSelectedDifficulty('all')}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="all-difficulty" className="ml-2 text-sm text-gray-700">
              Tất cả
            </label>
          </div>
          {difficulties.map(difficulty => (
            <div className="flex items-center" key={difficulty}>
              <input
                id={`difficulty-${difficulty}`}
                type="radio"
                name="difficulty"
                checked={selectedDifficulty === difficulty}
                onChange={() => setSelectedDifficulty(difficulty)}
                className="h-4 w-4 text-primary"
              />
              <label htmlFor={`difficulty-${difficulty}`} className="ml-2 text-sm text-gray-700">
                {difficulty}
              </label>
            </div>
          ))}
        </div>
      </div>
      
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
          setSelectedDifficulty('all');
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