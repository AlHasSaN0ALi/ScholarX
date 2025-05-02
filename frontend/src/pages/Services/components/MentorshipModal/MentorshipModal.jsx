import React, { useState } from 'react';
import './MentorshipModal.css';

const MentorshipModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    goal: '',
    area: '',
    expectations: '',
    availability: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Mentorship request submitted:', formData);
    // Close modal after submission
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Request a Mentor</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="program-description">
            <p>
              Our mentorship program connects you with experienced professionals who can guide you through 
              scholarship applications, essay writing, interviews, and career planning. Get personalized 
              advice and support from mentors who've been in your shoes.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="goal">What are your main goals for seeking mentorship?</label>
              <textarea 
                id="goal" 
                name="goal" 
                value={formData.goal}
                onChange={handleChange}
                placeholder="E.g., Scholarship applications, career guidance, interview preparation..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">What specific area or field are you interested in?</label>
              <textarea 
                id="area" 
                name="area" 
                value={formData.area}
                onChange={handleChange}
                placeholder="E.g., Engineering, Medicine, Business, Computer Science..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expectations">What do you expect to gain from this mentorship?</label>
              <textarea 
                id="expectations" 
                name="expectations" 
                value={formData.expectations}
                onChange={handleChange}
                placeholder="E.g., Industry insights, application review, career advice..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="availability">What is your availability for mentorship sessions?</label>
              <textarea 
                id="availability" 
                name="availability" 
                value={formData.availability}
                onChange={handleChange}
                placeholder="E.g., Weekday evenings, weekend afternoons..."
                required
              />
            </div>

            <button type="submit" className="submit-button">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorshipModal;