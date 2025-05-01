import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import { CiSearch } from "react-icons/ci";
import { CiSquareChevDown } from "react-icons/ci";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="search-container">
      <div className="text-content">
        <span className="courses-span">Courses</span>
        <h1 className="discover-heading">Discover Our Courses</h1>
        <p className="description">Scholarships, Mentorship & Skill Development Opportunities</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <div className="input-group">
          <label htmlFor="course-name-1">Course name</label>
          <div className="input-wrapper">
            <CiSearch className="icon-left" />
            <input
              type="text"
              id="course-name-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name course"
              className="search-input"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="course-name-2">Course name</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-name-2"
       
              placeholder="Search name course"
              className="search-input"
            />
            <CiSquareChevDown className="icon-right" />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="course-name-3">Course name</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-name-3"
           
              placeholder="Search name course"
              className="search-input"
            />
            <CiSquareChevDown className="icon-right" />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="course-name-4">Course name</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-name-4"
            
              placeholder="Search name course"
              className="search-input"
            />
            <CiSquareChevDown className="icon-right" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;