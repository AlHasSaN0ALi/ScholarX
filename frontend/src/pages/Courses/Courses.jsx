import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import CourseCard from './CourseCard';
import './Courses.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './SearchBar/SearchBar';
import { CiSearch } from "react-icons/ci";
import { CiSquareChevDown } from "react-icons/ci";

function Courses() {
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [scholarx, setScholarx] = useState([]);
  const [searchedCourses, setSearchedCourses] = useState([]);
  const [latestPage, setLatestPage] = useState(1);
  const [featuredPage, setFeaturedPage] = useState(1);
  const [scholarxPage, setScholarxPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [latestPagination, setLatestPagination] = useState({});
  const [searchPagination, setSearchPagination] = useState({});
  const [featuredPagination, setFeaturedPagination] = useState({});
  const [scholarxPagination, setScholarxPagination] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch search results when searchTerm changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim()) {
        try {
          const response = await fetch(`http://localhost:3000/api/courses/search?title=${encodeURIComponent(searchTerm.trim())}&page=${searchPage}`);
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
          const data = await response.json();
          setSearchedCourses(data.data.courses || []);
          setSearchPagination(data.data.pagination || {});
        } catch (err) {
          console.error('Error fetching search results:', err);
          setError(err.message);
        }
      } else {
        setSearchedCourses([]);
        setSearchPagination({});
      }
    };

    fetchSearchResults();
  }, [searchTerm, searchPage]);

  useEffect(() => {
    const fetchSearchedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/courses?page=${latestPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch latest courses');
        }
        const data = await response.json();
        setLatest(data.data.courses || []);
        
        setLatestPagination(data.data.pagination || {});
      } catch (err) {
        console.error('Error fetching latest courses:', err);
        setError(err.message);
      }
    };

    fetchSearchedCourses();
  }, [latestPage]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/courses?category=Featured&page=${featuredPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch featured courses');
        }
        const data = await response.json();
        setFeatured(data.data.courses || []);
        // console.log(data.data.courses);

        setFeaturedPagination(data.data.pagination || {});
      } catch (err) {
        console.error('Error fetching featured courses:', err);
        setError(err.message);
      }
    };

    fetchFeaturedCourses();
  }, [featuredPage]);

  useEffect(() => {
    const fetchScholarXCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/courses?category=ScholarX&page=${scholarxPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch ScholarX courses');
        }
        const data = await response.json();
        setScholarx(data.data.courses || []);
        // console.log(data.data.courses);
        
        setScholarxPagination(data.data.pagination || {});
      } catch (err) {
        console.error('Error fetching ScholarX courses:', err);
        setError(err.message);
      }
    };

    fetchScholarXCourses();
  }, [scholarxPage]);

  if (error) {
    return <div className="alert alert-danger m-5">Error: {error}</div>;
  }

  return (
    <>
      {/* <NavBar /> */}

      <div className="search-container">
        <div className="text-content">
          <span className="courses-span">Courses</span>
          <h1 className="discover-heading">Discover Our Courses</h1>
          <p className="description">Scholarships, Mentorship & Skill Development Opportunities</p>
        </div>

        <form className="search-bar">
          <div className="input-group">
            {/* <label htmlFor="course-name-1">Course name</label> */}
            <div className="input-wrapper">
              <CiSearch className="icon-left" />
              <input
                type="text"
                id="course-name-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by course title"
                className="search-input"
              />
            </div>
          </div>
        </form>
      </div>


      <div className="container-fluid p-5">
        {searchTerm.trim() && (
          <>
            <h2 className="mb-3">Search Results for: <span className="text-primary">{searchTerm}</span></h2>
            {searchedCourses.length > 0 ? (
              <>
                <div className="row g-3 mb-4">
                  {searchedCourses.map(course => (
                    <div className="col-md-4" key={course._id}>
                      <CourseCard course={course} section="search" />
                    </div>
                  ))}
                </div>
                <div className="mb-5 text-center">
                  <button 
                    className="btn btn-primary me-2" 
                    disabled={!searchPagination.hasPreviousPage} 
                    onClick={() => setSearchPage(p => p - 1)}
                  >
                    &lt;&lt;
                  </button>
                  <button 
                    className="btn btn-primary" 
                    disabled={!searchPagination.hasNextPage} 
                    onClick={() => setSearchPage(p => p + 1)}
                  >
                    &gt;&gt;
                  </button>
                </div>
              </>
            ) : (
              <div className="alert alert-info">No courses found matching your search.</div>
            )}
          </>
        )}

        {!searchTerm.trim() && (
          <>
            <h2 className="mb-3"><span className="text-primary">Latest</span> Courses</h2>
            <div className="row g-3 mb-4">
              {latest.map(course => (
                <div className="col-md-4" key={course._id}>
                  <CourseCard course={course} section="latest" />
                </div>
              ))}
            </div>
            <div className="mb-5 text-center">
              <button className="btn btn-primary me-2" disabled={!latestPagination.hasPreviousPage} onClick={() => setLatestPage(p => p - 1)}>&lt;&lt;</button>
              <button className="btn btn-primary" disabled={!latestPagination.hasNextPage} onClick={() => setLatestPage(p => p + 1)}>&gt;&gt;</button>
            </div>

            {featured.length > 0 && (
              <>
                <h2 className="mb-3"><span className="text-primary">Featured</span> Courses</h2>
                <div className="row g-3 mb-4">
                  {featured.map(course => (
                    <div className="col-md-4" key={course._id}>
                      <CourseCard course={course} section="featured" />
                    </div>
                  ))}
                </div>
                <div className="mb-5 text-center">
                  <button className="btn btn-primary me-2" disabled={!featuredPagination.hasPreviousPage} onClick={() => setFeaturedPage(p => p - 1)}>&lt;&lt;</button>
                  <button className="btn btn-primary" disabled={!featuredPagination.hasNextPage} onClick={() => setFeaturedPage(p => p + 1)}>&gt;&gt;</button>
                </div>
              </>
            )}

            {scholarx.length > 0 && (
              <>
                <h2 className="mb-3"><span className="text-primary">ScholarX</span> Courses</h2>
                <div className="row g-3 mb-4">
                  {scholarx.map(course => (
                    <div className="col-md-4" key={course._id}>
                      <CourseCard course={course} section="scholarx" />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button className="btn btn-primary me-2" disabled={!scholarxPagination.hasPreviousPage} onClick={() => setScholarxPage(p => p - 1)}>&lt;&lt;</button>
                  <button className="btn btn-primary" disabled={!scholarxPagination.hasNextPage} onClick={() => setScholarxPage(p => p + 1)}>&gt;&gt;</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Courses; 