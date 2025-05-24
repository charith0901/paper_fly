import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'medium', className = '' }) => {
  const baseStyle = "rounded font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
  const variants = {
    primary: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
  };
  
  const sizes = {
    small: "py-1 px-2 text-sm",
    medium: "py-2 px-4",
    large: "py-3 px-6 text-lg"
  };
  
  const buttonClasses = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
