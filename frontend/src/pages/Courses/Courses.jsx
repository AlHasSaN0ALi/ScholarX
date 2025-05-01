import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import CourseCard from './CourseCard';
import './Courses.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Courses() {
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [scholarx, setScholarx] = useState([]);
  const [latestPage, setLatestPage] = useState(1);
  const [featuredPage, setFeaturedPage] = useState(1);
  const [scholarxPage, setScholarxPage] = useState(1);
  const [latestPagination, setLatestPagination] = useState({});
  const [featuredPagination, setFeaturedPagination] = useState({});
  const [scholarxPagination, setScholarxPagination] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestCourses = async () => {
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

    fetchLatestCourses();
  }, [latestPage]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/featured?page=${featuredPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch featured courses');
        }
        const data = await response.json();
        setFeatured(data.data.courses || []);
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
        const response = await fetch(`http://localhost:3000/api/courses/scholarx?page=${scholarxPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch ScholarX courses');
        }
        const data = await response.json();
        setScholarx(data.data.courses || []);
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
      <NavBar />

      <div className="container-fluid p-5">

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

        <h2 className="mb-3"><span className="text-primary">ScholarX</span> Courses</h2>
        <div className="row g-3 mb-4">
          {scholarx.map(course => (
            <div className="col-md-4" key={course._id}>
              <CourseCard course={course} section="scholarx" />
            </div>
          ))}
        </div>
        <div className='text-center'>
          <button className="btn btn-primary me-2" disabled={!scholarxPagination.hasPreviousPage} onClick={() => setScholarxPage(p => p - 1)}>&lt;&lt;</button>
          <button className="btn btn-primary" disabled={!scholarxPagination.hasNextPage} onClick={() => setScholarxPage(p => p + 1)}>&gt;&gt;</button>
        </div>
      </div>
    </>
  );
}

export default Courses; 