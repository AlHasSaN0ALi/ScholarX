import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import './Services.css';
import { FaUsers, FaPodcast } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';

function Services() {
  return (
    <div className="services-page">
      <NavBar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <img src="/whitelogo.png" alt="ScholarX Logo" className="scholarx-logo" />
          </div>
          <div className="hero-text">
            <h1>Take the Lead. Spark Inspiration. Shape the Future.</h1>
            <p>Empower your Peers, Lead your Community</p>
          </div>
          <button className="learn-more-btn">Learn More</button>
        </div>
      </section>

      {/* Programs Section */}
      <section className="programs-section">
        <div className="section-container">
          <h2 className="section-title">Our Programs</h2>
          
          <div className="programs-container">
            <div className="program-card">
              <div className="program-icon ambassador">
                <FaUsers />
              </div>
              <h3>Ambassador Program</h3>
              <p>Lead, organize events, and mentor peers at your school/university. Develop leadership skills and make an impact.</p>
              <button className="program-btn apply-btn">Apply Now</button>
            </div>

            <div className="program-card">
              <div className="program-icon mentorship">
                <MdWork />
              </div>
              <h3>Mentorship & Career Guidance</h3>
              <p>Get 1-on-1 mentorship for essays, interviews, and career development from experienced professionals.</p>
              <button className="program-btn request-btn">Request Mentor</button>
            </div>

            <div className="program-card">
              <div className="program-icon podcast">
                <FaPodcast />
              </div>
              <h3>ScholarX Podcast</h3>
              <p>Listen to real stories from scholarship alumni, get practical advice, and join live Q&A sessions.</p>
              <button className="program-btn podcast-btn">Listen to Podcast</button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-section">
        <div className="section-container">
          <h2 className="section-title">Success Stories</h2>
          
          <div className="stories-container">
            <div className="story-card">
              <div className="story-profile">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson" className="profile-img" />
                <div className="profile-info">
                  <h4>Sarah Johnson</h4>
                  <p>Ambassador 2024</p>
                </div>
              </div>
              <p className="story-text">Being a ScholarX ambassador transformed my leadership skills and helped me build an amazing network of peers.</p>
            </div>

            <div className="story-card">
              <div className="story-profile">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="David Chen" className="profile-img" />
                <div className="profile-info">
                  <h4>David Chen</h4>
                  <p>Mentee 2024</p>
                </div>
              </div>
              <p className="story-text">The mentorship program provided invaluable guidance for my scholarship applications and career planning</p>
            </div>

            <div className="story-card">
              <div className="story-profile">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Emma Rodriguez" className="profile-img" />
                <div className="profile-info">
                  <h4>Emma Rodriguez</h4>
                  <p>Podcast Guest</p>
                </div>
              </div>
              <p className="story-text">Sharing my story on the ScholarX podcast inspired others and helped me connect with amazing opportunities</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Services; 