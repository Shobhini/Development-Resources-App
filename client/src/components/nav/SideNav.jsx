import React, { useState } from "react";
import NavItem from "./NavItems";
import { AiOutlineSearch } from "react-icons/ai";
import SideNavMobile from "./SideNavMobile";
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function SideNav() {
  const [showSideNav, setShowSideNav] = useState(false);
  const [searchResult, setSearchResult] = useState("");
  const { user } = useAuth()
  let debounceTimer;

  const clickHandler = () => {
    setShowSideNav(!showSideNav);
  };

  const handleInputChange = (event) => {
    setSearchResult(event.target.value);
    // Perform any other actions here, if needed
  };

  // Debounce function
  const debounce = (func, delay) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
  };  

  return (
    <>
      {/* Main sidebar - hidden on mobile when mobile sidebar is shown */}
      <div
        className={`flex flex-col fixed h-full py-2 px-4 text-lg w-52 bg-gradient-to-b from-[#62849f] to-[#a8abae] ${
          showSideNav ? 'hidden lg:flex' : 'hidden lg:flex'
        }`}
      >
        <div className="search flex items-center gap-4 bg-[#8de2f1] rounded-2xl px-2 py-[4px] mt-12">
          <AiOutlineSearch />
          <input
            onChange={(e) => debounce(() => handleInputChange(e), 1500)}
            style={{ background: "transparent", outline: "none", width: "100%" }}
            placeholder="search..."
          ></input>
        </div>

        {/* nav */}
        <div className="flex flex-col p-2 mt-4 gap-6 flex-1 overflow-y-auto">
          <NavItem searchResult={searchResult} />
        </div>

        {user && (
          <div className="mt-auto border-t border-gray-500 pt-4 flex flex-col gap-1 px-2">
            <NavLink to="/submit" className="text-blsck-300 hover:text-blue-500 text-sm py-1 px-2 rounded hover:bg-white/10 transition-colors">
              Submit Resource
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className="text-yellow-400 hover:text-yellow-300 text-sm py-1 px-2 rounded hover:bg-white/10 transition-colors">
                Admin
              </NavLink>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu toggle button - only visible on mobile */}
      {!showSideNav ? (
        <div className="absolute z-10 block lg:hidden h-fit p-[4px] py-[0.5px] cursor-pointer rounded-full ml-6 mt-6 bg-[#828e93]">
          <i
            onClick={clickHandler}
            className="fa-solid fa-bars p-4 text-2xl text-[#f4ebeb]"
          ></i>
        </div>
      ) : (
        <SideNavMobile setShowSideNav={() => setShowSideNav(!showSideNav)} />
      )}
    </>
  );
}

export default SideNav;
