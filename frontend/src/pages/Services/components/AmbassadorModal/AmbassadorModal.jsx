import React, { useState } from 'react';
import './AmbassadorModal.css';

const AmbassadorModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    motivation: '',
    promotionPlan: '',
    experience: '',
    questions: ''
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
    console.log('Form submitted:', formData);
    // Close modal after submission
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Ambassador Program Application</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="program-description">
            <p>
              We empower students to become ScholarX Ambassadors in their universities and schools. Ambassadors serve as 
              leaders in their communities, spreading awareness about scholarships, mentoring peers, and organizing events that 
              connect students with life-changing opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="motivation">What motivates you to become a ScholarX Ambassador?</label>
              <textarea 
                id="motivation" 
                name="motivation" 
                value={formData.motivation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="promotionPlan">How would you promote scholarship opportunities within your school or university?</label>
              <textarea 
                id="promotionPlan" 
                name="promotionPlan" 
                value={formData.promotionPlan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Do you have any previous experience in leadership, mentoring, or event organization?</label>
              <textarea 
                id="experience" 
                name="experience" 
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="questions">How would you handle questions or concerns from students about scholarship applications?</label>
              <textarea 
                id="questions" 
                name="questions" 
                value={formData.questions}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-button">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorModal;