import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <button
      onClick={handleBack}
      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
    >
      Quay lại
    </button>
  );
};

export default BackButton;
