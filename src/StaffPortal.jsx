import { useState } from "react";
import StaffList from "./StaffList";
import Footer from "./Footer";
import StaffHeader from "./StaffHeader";
import LeaveForm from "./LeaveForm";
import LoanRequestForm from "./LoanRequestForm";
import LoanHistory from "./LoanHistory";
import LeaveHistory from "./LeaveHistory";

function StaffPortal({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("staffList");

return (
  <div className="flex flex-col min-h-screen">
    <header >
      <StaffHeader setCurrentView={setCurrentView} />
    </header>

    {/* Add padding-top to main to offset fixed header height */}
    <main className="flex-grow overflow-auto p-4 pt-24">
      {currentView === "staffList" && <StaffList />}
      {currentView === "leave" && <LeaveForm user={user} />}
      {currentView === "loan" && <LoanRequestForm />}
      {currentView === "loanhistory" && <LoanHistory />}
      {currentView === "leavehistory" && <LeaveHistory />}
    </main>

    <Footer />
  </div>
);

}

export default StaffPortal;
