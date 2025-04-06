import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          KnowGo Admin
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            className="text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 5h16M4 12h16M4 19h16"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <div
          className={`w-full lg:w-auto ${
            isOpen ? "block" : "hidden"
          } lg:flex lg:items-center mt-4 lg:mt-0`}
        >
          <div className="text-sm lg:flex lg:items-center lg:space-x-6">
            <Link
              to="/"
              className="block lg:inline-block text-gray-300 hover:text-white transition duration-300 mb-2 lg:mb-0"
            >
              Create Mate
            </Link>
            <Link
              to="/list"
              className="block lg:inline-block text-gray-300 hover:text-white transition duration-300 mb-2 lg:mb-0"
            >
              Mates
            </Link>
            <Link
              to="/404"
              className="block lg:inline-block text-gray-300 hover:text-white transition duration-300 mb-2 lg:mb-0"
            >
              404
            </Link>
            <button
              onClick={() =>
                alert("Logging out... Sarthak har jagh hath nahi marte!😂")
              }
              className="block lg:inline-block text-sm px-4 py-2 mt-2 lg:mt-0 border rounded text-white border-gray-300 hover:border-transparent hover:text-gray-900 hover:bg-white transition duration-300 mb-2 lg:mb-0"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
