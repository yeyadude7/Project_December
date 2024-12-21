import React, { useState } from "react";
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
            <a
              onClick={toggleFilterModal}
              className="block px-4 py-2 text-sm text-gray-700 
                            hover:bg-gray-100"
              role="menuitem"
            >
              Filters
            </a>
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
        <div
        id="popup-modal"
        tabindex="-1"
        class=""
      >
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            
            <div class="p-4 md:p-5 text-center">
              <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Popular Filters
              </h3>

              {/* Filter options will be underneath here */}
              <div className="grid grid-cols-3 gap-2 pb-4">
                <button className="tag hover:bg-sky-700 active:bg-sky-700 focus:bg-sky-700">Workshop</button>
                <button className="tag">Workshop</button>
                <button className="tag">Workshop</button>
                <button className="tag">Workshop</button>
                <button className="tag">Workshop</button>
                <button className="tag">Workshop</button>
                <button className="tag">Workshop</button>
                <button className="tag">Workshop</button>
                <button className="tag">Workshop</button>
              </div>


              <button
                data-modal-hide="popup-modal"
                type="button"
                class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Save
              </button>
              
              <button
                onClick={toggleFilterModal}
                data-modal-hide="popup-modal"
                type="button"
                class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Dropdown;
