import React from 'react';
import courseImg from '../../assets/Images/image.png';
import './Courses.css';
import { FaRegHeart, FaStar, FaRegStar, FaChevronRight, FaClock, FaPlayCircle, FaMoneyBill } from 'react-icons/fa';

const CourseCard = ({ course, section = 'latest' }) => {
  // Fallbacks for missing data
  const title = course.title || 'Course Title';
  const category = course.category || 'Category';
  const hours = course.totalDuration || 30.2;
  const lectures = course.totalLessons || 14;
  const price = course.currentPrice || 0;
  const oldPrice = course.oldPrice || 0;
  const instructor = course.instructor?.name || 'Instructor';
  const reviews = course.reviews || 12;
  const rating = course.rating || 4;

  // Calculate if course is new (created in last 7 days)
  let isNew = false;
  if (course.createdAt) {
    const createdDate = new Date(course.createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    isNew = diffDays <= 7;
  }

  // Determine what badge to show
  const showBadge = () => {
    if (section === 'latest' && isNew) {
      return <span className="cart-badge position-absolute top-0 start-0 mt-2">New</span>;
    } else if (course.category) {
      return <span className="cart-badge position-absolute top-0 start-0 mt-2">{category}</span>;
    }
    return null;
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <img src={courseImg} className="card-img-top" alt="Course" style={{height: '180px', objectFit: 'cover'}} />
        {showBadge()}
        <button className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle p-2" style={{zIndex:2}}>
          <FaRegHeart />
        </button>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="time-badge"><FaClock style={{marginRight: 4}}/> {hours} Hour</span>
          <span className="lecture-badge"><FaPlayCircle style={{marginRight: 4}}/> {lectures} Lectures</span>
          {price > 0 && <span className="lecture-badge"><FaMoneyBill style={{marginRight: 4}}/>Paid</span>}
        </div>
        <h5 className="card-title mb-1" style={{minHeight: '48px'}}>{title}</h5>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div>
            <button className="btn btn-primary w-100 mb-2">Enroll Now</button>
          </div>
          <div>
            <span className="fw-bold text-primary me-2">{price} EGP</span>
            {oldPrice > 0 && <span className="text-muted text-decoration-line-through">{oldPrice} EGP</span>}
          </div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">
            {[...Array(5)].map((_, i) => (
              i < rating ? <FaStar key={i} style={{color: '#ffc107'}} /> : <FaRegStar key={i} style={{color: '#e4e5e9'}} />
            ))}
          </div>
          <span className="text-muted">{reviews} reviews</span>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-4">
          <div>
            <img src={course.instructor?.profilePicture || 'https://ui-avatars.com/api/?name=' + instructor} alt="Instructor" className="rounded-circle me-2" width="32" height="32" />
            <span className="fw-semibold">{instructor}</span>
          </div>
          <div className="card-footer bg-white border-0 text-end">
            <a href="#" className="text-decoration-none">Details <FaChevronRight style={{verticalAlign: 'middle'}} /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 