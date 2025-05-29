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

  return (
    <div className="flex md:space-x-6 space-x-2 items-center mb-10 flex-wrap">
      <p
        className={filterButtonClass(filter === "html")}
        onClick={() => handleFilterChange("html")}
      >
        HTML
      </p>
      <p
        className={filterButtonClass(filter === "css")}
        onClick={() => handleFilterChange("css")}
      >
        CSS
      </p>
      <p
        className={filterButtonClass(filter === "js")}
        onClick={() => handleFilterChange("js")}
      >
        Javascript
      </p>
      <p
        className={filterButtonClass(filter === "tailwind")}
        onClick={() => handleFilterChange("tailwind")}
      >
        Tailwind CSS
      </p>
      <p
        className={filterButtonClass(filter === "nextjs")}
        onClick={() => handleFilterChange("nextjs")}
      >
        NextJS
      </p>
      <p
        className={filterButtonClass(filter === "react")}
        onClick={() => handleFilterChange("react")}
      >
        ReactJS
      </p>
      {/* <p
        className={`px-3 py-1 rounded-xl cursor-pointer ${filter === "react" ? 'border':''}`}
        onClick={() => handleFilterChange('next')}
      >
        NextJS
      </p>
      <p
        className={`px-3 py-1 rounded-xl cursor-pointer ${filter === "react" ? 'border':''}`}
        onClick={() => handleFilterChange('angular')}
      >
        AngularJS
      </p>
      <p
        className={`px-3 py-1 rounded-xl cursor-pointer ${filter === "react" ? 'border':''}`}
        onClick={() => handleFilterChange('threejs')}
      >
        ThreeJS
      </p> */}
    </div>
  );
};

export default index;