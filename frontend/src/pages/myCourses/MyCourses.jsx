import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import CourseCard from '../Courses/CourseCard';
import api from '../../services/api';
import './MyCourses.css';

const MyCourses = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (user && user.courses && user.courses.length > 0) {
        try {
          const response = await api.post('/courses/by-ids', { ids: user.courses });
          setCourses(response.data.data.courses);
        } catch (error) {
          setCourses([]);
        }
      }
      setLoading(false);
    };
    fetchCourses();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!courses.length) return <div>You have no courses yet.</div>;

  return (
    <div className="my-courses-page">
      <h2>My Courses</h2>
      <div className="courses-list">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default MyCourses; 