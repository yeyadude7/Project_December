import React, { useState } from "react";
import FilterModal from "../FilterModal/filterModal";
import { Link } from "react-router-dom";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFilterModal, setFilterModal] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleFilterModal = () => {
    setFilterModal(!showFilterModal);
  }

  return (
    <>

      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center rounded-md 
                    border border-gray-300 shadow-sm px-4 py-2 bg-white 
                    text-sm font-medium text-gray-700 hover:bg-gray-50 
                    focus:outline-none"
        >
          Options
        </button>
      </div>

      {isOpen && (
        <div
          className="mt-2 w-56 
                    rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5
                    focus:outline-none"
          role="menu"
        >
          <div className="py-1" role="none">
            <button
              onClick={toggleFilterModal}
              className="block px-4 py-2 text-sm text-gray-700 
                            hover:bg-gray-100"
              role="menuitem"
            >
              Filters
            </button>
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-100"
              role="menuitem"
            >
              Logout
            </Link>
          </div>
        </div>
        
      )}

      {showFilterModal && (
        <div>
          <FilterModal></FilterModal>
        </div>
      )}
    </>
  );
};

export default Dropdown;
