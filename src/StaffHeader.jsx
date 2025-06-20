import { useState } from "react";

function Header({ setCurrentView }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white shadow-md h-20 px-4 sm:px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <img src="rfr.png" alt="Company Logo" className="w-20 h-20 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Staff Portal</h1>
        </div>

        {/* Hamburger for Mobile */}
        <button
          className="sm:hidden text-gray-800 text-3xl"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:block w-auto">
          <ul className="flex gap-6 text-base font-semibold text-gray-800">
            <li
              onClick={() => setCurrentView("staffList")}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Staff Directory
            </li>

            {/* Leave Dropdown */}
            <li className="relative group">
              <div className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors">
                Leave Request
              </div>
              <ul className="absolute left-0 mt-1 bg-white shadow-md rounded hidden group-hover:block w-40 z-50">
                <li
                  onClick={() => setCurrentView("leave")}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm"
                >
                  New Leave
                </li>
                <li
                  onClick={() => setCurrentView("leavehistory")}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm"
                >
                  Leave History
                </li>
              </ul>
            </li>

            {/* Loan Dropdown */}
            <li className="relative group">
              <div className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors">
                Loan Request
              </div>
              <ul className="absolute left-0 mt-1 bg-white shadow-md rounded hidden group-hover:block w-40 z-50">
                <li
                  onClick={() => setCurrentView("loan")}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm"
                >
                  New Loan
                </li>
                <li
                  onClick={() => setCurrentView("loanhistory")}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm"
                >
                  Loan History
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-60 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:hidden
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center space-x-4">
            <img src="rfr.png" alt="Company Logo" className="w-16 h-16 object-contain" />
            <h1 className="text-xl font-bold text-gray-800">Staff Portal</h1>
          </div>
          <button
            className="text-gray-800 text-2xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <nav className="p-4">
          <ul className="flex flex-col gap-3 text-base font-semibold text-gray-800">
            <li
              onClick={() => {
                setCurrentView("staffList");
                setSidebarOpen(false);
              }}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Staff Directory
            </li>

            {/* Leave Group */}
            <li
              onClick={() => {
                setCurrentView("leave");
                setSidebarOpen(false);
              }}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Leave Request
            </li>
            <li
              onClick={() => {
                setCurrentView("leavehistory");
                setSidebarOpen(false);
              }}
              className="ml-4 pl-2 text-sm text-gray-600 cursor-pointer hover:text-blue-800"
            >
              ↳ Leave History
            </li>

            {/* Loan Group */}
            <li
              onClick={() => {
                setCurrentView("loan");
                setSidebarOpen(false);
              }}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Loan Request
            </li>
            <li
              onClick={() => {
                setCurrentView("loanhistory");
                setSidebarOpen(false);
              }}
              className="ml-4 pl-2 text-sm text-gray-600 cursor-pointer hover:text-blue-800"
            >
              ↳ Loan History
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-30 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Header;
