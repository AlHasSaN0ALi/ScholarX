import React from 'react';
import './CustomCheckbox.css';

const CustomCheckbox = ({ checked, onChange, label }) => {
  const checkboxStyle = {
    margin: 0,
    marginRight: '5px',
    padding: 0,
    width: '16px',
    height: '16px',
    backgroundColor: 'white',
    border: '1px solid #ced4da',
    appearance: 'auto',
    WebkitAppearance: 'auto'
  };

  const labelStyle = {
    margin: 0,
    padding: 0,
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    lineHeight: 1.5,
    fontWeight: 'normal'
  };

  return (
    <div className="custom-checkbox-container">
      <input 
        type="checkbox" 
        className="custom-checkbox-input" 
        checked={checked} 
        onChange={onChange} 
        id="customCheckbox"
        style={checkboxStyle}
      />
      <label 
        className="custom-checkbox-label" 
        htmlFor="customCheckbox"
        style={labelStyle}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox; 