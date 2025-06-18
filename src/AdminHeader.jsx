import { useState } from "react";

function AdminHeader({ setCurrentView }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white shadow-md h-20 px-4 sm:px-6">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          <img src="rfr.png" alt="Company Logo" className="w-20 h-20 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Admin Portal</h1>
        </div>

        {/* Hamburger button - Mobile only */}
        <button
          className="sm:hidden text-gray-800 text-3xl"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:block w-auto">
          <ul className="flex gap-6 text-base font-semibold text-gray-800">
            <li
              onClick={() => setCurrentView("pettycash")}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Petty Cash
            </li>
            <li
              onClick={() => setCurrentView("Staff_Profile")}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Staff_Profile
            </li>
            <li
              onClick={() => setCurrentView("payroll")}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Payroll Management
            </li>

             <li
              onClick={() => setCurrentView("loanhistory")}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Loan History
            </li>

            <li
              onClick={() => setCurrentView("leavehistory")}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Leave History
            </li>

          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar - slide in */}
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
          <ul className="flex flex-col gap-4 text-base font-semibold text-gray-800">
            <li
              onClick={() => {
                setCurrentView("pettycash");
                setSidebarOpen(false);
              }}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Petty Cash
            </li>
            <li
              onClick={() => {
                setCurrentView("Staff_Profile");
                setSidebarOpen(false);
              }}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Staff_Profile
            </li>
            <li
              onClick={() => {
                setCurrentView("payroll");
                setSidebarOpen(false);
              }}
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
            >
              Payroll Management
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay behind sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-30 z-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default AdminHeader;
