import { useState } from "react";
import AdminNotifications from "./AdminNotifications";

function AdminHeader({ setCurrentView }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const NavItem = ({ name, viewKey, onClick }) => (
    <li
      onClick={() => {
        setCurrentView(viewKey);
        if (onClick) onClick(); // for closing mobile sidebar
      }}
      className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors"
    >
      {name}
    </li>
  );

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white shadow-md h-20 px-4 sm:px-6 lg:px-12">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          <img src="rfr.png" alt="Company Logo" className="w-16 h-16 object-contain" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 hidden sm:block">
            Admin Portal
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-base font-semibold text-gray-800">
          <ul className="flex gap-6 items-center">
            <NavItem name="Display" viewKey="admin" />
            <NavItem name="Petty Cash" viewKey="pettycash" />
            <NavItem name="Staff Profile" viewKey="Staff_Profile" />
            <NavItem name="Payroll Management" viewKey="payroll" />

            {/* Loan Dropdown */}
            <li className="relative group">
              <span className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors">
                Loan
              </span>
              <ul className="absolute hidden group-hover:block bg-white shadow-md rounded mt-1 min-w-[12rem] text-sm font-normal z-50">
                <NavItem name="Loan History" viewKey="loanhistory" />
                <NavItem name="Repayment" viewKey="repay" />
              </ul>
            </li>

            {/* Leave Dropdown */}
            <li className="relative group">
              <span className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-3 py-2 transition-colors">
                Leave
              </span>
              <ul className="absolute hidden group-hover:block bg-white shadow-md rounded mt-1 min-w-[12rem] text-sm font-normal z-50">
                <NavItem name="Leave History" viewKey="leavehistory" />
              </ul>
            </li>
          </ul>

          {/* Notifications after nav items */}
          <AdminNotifications />
        </nav>

        {/* Mobile: Hamburger + Notification */}
        <div className="sm:hidden flex items-center space-x-4">
          <AdminNotifications />
          <button
            className="text-gray-800 text-3xl"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 max-w-[80%] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <img src="rfr.png" alt="Logo" className="w-12 h-12 object-contain" />
            <h2 className="text-lg font-bold text-gray-800">Staff Portal</h2>
          </div>
          <button
            className="text-gray-800 text-2xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
          <ul className="flex flex-col gap-3 text-base font-medium text-gray-800">
            <NavItem name="Display" viewKey="admin" onClick={() => setSidebarOpen(false)} />
            <NavItem name="Petty Cash" viewKey="pettycash" onClick={() => setSidebarOpen(false)} />
            <NavItem name="Staff Profile" viewKey="Staff_Profile" onClick={() => setSidebarOpen(false)} />
            <NavItem name="Payroll Management" viewKey="payroll" onClick={() => setSidebarOpen(false)} />

            {/* Mobile: Loan Toggle */}
            <li>
              <button
                onClick={() => setLoanOpen(!loanOpen)}
                className="w-full text-left flex justify-between items-center px-3 py-2 rounded hover:bg-blue-100"
              >
                <span>Loan</span>
                <span>{loanOpen ? "−" : "+"}</span>
              </button>
              {loanOpen && (
                <ul className="ml-4 mt-1 space-y-1">
                  <NavItem name="Loan History" viewKey="loanhistory" onClick={() => setSidebarOpen(false)} />
                  <NavItem name="Repayment" viewKey="repay" onClick={() => setSidebarOpen(false)} />
                </ul>
              )}
            </li>

            {/* Mobile: Leave Toggle */}
            <li>
              <button
                onClick={() => setLeaveOpen(!leaveOpen)}
                className="w-full text-left flex justify-between items-center px-3 py-2 rounded hover:bg-blue-100"
              >
                <span>Leave</span>
                <span>{leaveOpen ? "−" : "+"}</span>
              </button>
              {leaveOpen && (
                <ul className="ml-4 mt-1 space-y-1">
                  <NavItem name="Leave History" viewKey="leavehistory" onClick={() => setSidebarOpen(false)} />
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

export default AdminHeader;
