'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useKnowledgeBase } from '../page';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useKnowledgeBase();
  const [inputValue, setInputValue] = useState(searchQuery);

  // 当外部searchQuery改变时更新输入框
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // 处理搜索输入
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };

  // 延迟搜索，提高用户体验
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                    placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                    sm:text-sm transition duration-150 ease-in-out"
          placeholder="搜索文档名称..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="button"
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
            inputValue ? 'visible' : 'invisible'
          }`}
          onClick={() => {
            setInputValue('');
            setSearchQuery('');
          }}
        >
          <span className="text-gray-400 hover:text-gray-500 cursor-pointer font-bold">×</span>
        </button>
      </div>
      {/* <p className="mt-1 text-sm text-gray-500">
        符合 Dify 设计风格的简洁搜索栏
      </p> */}
    </form>
  );
};

export default SearchBar;
