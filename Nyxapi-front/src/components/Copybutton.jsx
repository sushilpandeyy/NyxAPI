import React, { useState } from 'react';
import { FaCopy } from "react-icons/fa";

const CopyButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000); // Change back after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={handleCopyClick}
        className={`py-2 px-4 rounded focus:outline-none flex items-center ${copied ? 'bg-green-500' : 'bg-pink-600'}`}
      >
        <FaCopy className="mr-2" />
      </div>
    </div>
  );
};

export default CopyButton;
