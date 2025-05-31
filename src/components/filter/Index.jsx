import React, { useState } from "react";

const index = ({ onStateChange }) => {
  const [filter, setFilter] = useState("html");

  const handleFilterChange = (target) => {
    setFilter(target);
    onStateChange(target);
  };

  const filterButtonClass = (isActive) => `
    px-3 py-1 rounded-xl cursor-pointer text-xs lg:text-base
    transition-all duration-200 ease-in-out

    ${isActive 
      ? 'bg-[#545454] text-white border-2 border-[#807f7f] shadow-md transform scale-105' 
      : 'bg-[#ddd] hover:bg-[#c4c4c4] text-gray-700'

    }
  `;


  const categories = ["html", "css", "javascript", "tailwind", "nextjs", "react"];
  return (
  <div className="flex md:space-x-6 space-x-2 items-center mb-10 flex-wrap">
  <div>
    {categories.map(cat => (
      <button
        key={cat}
        className={filterButtonClass(filter === cat)+ "mr-3 mb-2"} 
        onClick={() => handleFilterChange(cat)}
      >
        {cat.toUpperCase()}
      </button>
    ))}
  </div>
  </div>
  
);


  
};

export default index;