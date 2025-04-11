import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <div className="hero-text">
          <h1>Empower Your Academic Journey with ScholarX</h1>
          
          <p>
            ScholarX is your essential platform for choosing the 
            right university. We offer personalized guidance, 
            comprehensive resources, and scholarship 
            opportunities to help you make informed decisions 
            about your academic journey. Start your path to 
            success with ScholarX today!
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Take The First Step</button>
            <button className="secondary-btn">Read More</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 