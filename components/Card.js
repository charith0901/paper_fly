import React from 'react';

const Card = ({ title, content, image, footer }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {image && (
        <div className="w-full">
          <img className="w-full h-48 object-cover" src={image} alt={title} />
        </div>
      )}
      <div className="p-4">
        {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
        {content && <p className="text-gray-600 mt-2">{content}</p>}
      </div>
      {footer && <div className="px-4 py-3 bg-gray-100">{footer}</div>}
    </div>
  );
};

export default Card;
