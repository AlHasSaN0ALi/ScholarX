import React from 'react';
import './Features.css';

function Features() {
  return (
    <section className="features">
      <h2>Welcome to ScholarX</h2>
      <p className="features-description">
        ScholarX is your comprehensive academic support platform, designed to 
        bridge the gap between students and academic excellence through 
        personalized mentoring, resources, and community support.
      </p>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M12 12v7" />
              <path d="M7 14v3a5 5 0 0 0 10 0v-3" />
            </svg>
          </div>
          <h3>Expert Mentorship</h3>
          <p>Connect with experienced academics and industry professionals.</p>
        </div>


        <div className="feature-card">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="8" x2="16" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="12" y2="16" />
            </svg>
          </div>
          <h3>Resource Library</h3>
          <p>Access a vast collection of study materials and resources.</p>
        </div>


        <div className="feature-card">
          <div className="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="9" r="5" />
              <path d="M17 9a8 8 0 0 1-8 8" />
              <path d="M19 15c1.2-1.2 2-3 2-5a8 8 0 0 0-8-8c-2 0-3.8.8-5 2" />
            </svg>
          </div>
          <h3>Community Support</h3>
          <p>Join a thriving community of learners and educators.</p>
        </div>
      </div>
    </section>
  );
}

export default Features; 