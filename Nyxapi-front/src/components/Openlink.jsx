import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa'; // Import the icon from react-icons

const OpenUrlButton = ({ url }) => {
  const handleClick = () => {
    window.open(url, '_blank'); // Opens the URL in a new tab
  };

  return (
    <button
      onClick={handleClick}
      className={`py-2 px-4 rounded focus:outline-none flex items-center 'bg-pink-600'`}
      >
      <FaExternalLinkAlt className="mr-2" />
    </button>
  );
};

export default OpenUrlButton;
