import React, { useState, useEffect, useRef } from 'react';

function FilterSidebar({ 
  sortOptions,
  selectedSort,
  setSelectedSort,
  searchTerm,
  setSearchTerm,
  resetFilters,
  quizzes
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  // Regex kiểm tra input hợp lệ (cho phép chữ unicode, số, khoảng trắng, dấu - và ')
  const isValidInput = (input) => /^[\p{L}0-9\s'-]{0,100}$/u.test(input.trim());

  useEffect(() => {
    const trimmedTerm = searchTerm.trim();

    if (trimmedTerm && isValidInput(trimmedTerm)) {
      const matches = quizzes
        .filter(q =>
          q.title.toLowerCase().includes(trimmedTerm.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true); // Tự động bật khi có gợi ý
      setError('');
    } else {
      setSuggestions([]);
      setShowSuggestions(false); // Tắt khi không hợp lệ hoặc trống
      if(trimmedTerm !== '') setError('Chuỗi tìm kiếm không hợp lệ');
      else setError('');
    }
  }, [searchTerm, quizzes]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setError(''); // Xóa lỗi khi user đang nhập lại
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title.trim());
    setShowSuggestions(false);
    inputRef.current.blur(); // tắt focus khỏi input
    setError('');
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100); // delay để click suggestion không bị mất
  };

  // Hàm gọi khi user muốn submit tìm kiếm, vd khi bấm nút hoặc enter
  const handleSearchSubmit = () => {
    if (!isValidInput(searchTerm)) {
      setError('Chuỗi tìm kiếm không hợp lệ. Vui lòng kiểm tra lại.');
      return false;
    }
    setError('');
    // Thực hiện hành động tìm kiếm hoặc filter ở đây nếu cần
    // vd: call API, hoặc set filter...
    return true;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Bộ lọc</h3>

      {/* Tìm kiếm */}
      <div className="mb-6 relative">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</h4>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm quiz..."
            value={searchTerm}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
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
              onClick={() => {
                setSearchTerm('');
                setError('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}

        {/* Gợi ý tìm kiếm */}
        {showSuggestions && (
          <ul className="absolute z-10 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto text-sm">
            {suggestions.length > 0 ? (
              suggestions.map((sug) => (
                <li
                  key={sug.id}
                  onClick={() => handleSuggestionClick(sug.title)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {sug.title}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">Không tìm thấy kết quả</li>
            )}
          </ul>
        )}
      </div>

      {/* Nút submit tìm kiếm */}
      <button
        onClick={handleSearchSubmit}
        className="mb-6 w-full bg-primary text-white py-2 rounded-lg text-sm hover:bg-primary-dark transition"
      >
        Tìm kiếm
      </button>

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
