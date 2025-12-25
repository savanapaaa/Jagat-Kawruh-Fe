import React from 'react';
import './Button.css';

function Button({ children, variant = 'primary', size = 'medium', onClick, className = '' }) {
  return (
    <button 
      className={`button button-${variant} button-${size} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
