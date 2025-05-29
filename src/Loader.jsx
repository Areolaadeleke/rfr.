import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-24 h-24 rounded-full shadow-lg flex items-center justify-center">
        <div className="absolute w-10 h-10 border-4 border-blue-400 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;