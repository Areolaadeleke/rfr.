import { useState } from "react";
//import StaffList from "./StaffList";
import Footer from "./Footer";
import AdminHeader from "./AdminHeader";
import VoucherList from "./VoucherList";
import StaffTable from "./StaffTable";
import PayrollTable from "./PayrollTable";
import AdminLoanDashboard from "./AdminLoanDashboard";
import AdminLoanHistory from "./AdminLoanHistory";
import AdminLeaveHistory from "./AdminLeaveHistory";
import AdminDashboards from "./AdminDashboards";
import RepaymentManagement from "./RepaymentManagement";


function AdminDashboard({ users }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("admin");

return (
  <div className="flex flex-col min-h-screen">
    <header >
      <AdminHeader setCurrentView={setCurrentView} />
    </header>

    {/* Add padding-top to main to offset fixed header height */}
    <main className="flex-grow overflow-auto p-4 pt-24">
      {currentView === "pettycash" && <VoucherList users={users} />}
      {currentView === "Staff_Profile" && <StaffTable users={users} />}
      {currentView === "payroll" && <PayrollTable users={users} />}
      {currentView === "loan" && <AdminLoanDashboard users={users} />}
      {currentView === "loanhistory" && <AdminLoanHistory users={users} />}
      {currentView === "leavehistory" && <AdminLeaveHistory users={users} />}
      {currentView === "admin" && <AdminDashboards users={users} />}
      {currentView === "repay" && <RepaymentManagement users={users} />}
    </main>

    <Footer />
  </div>
);

}

export default AdminDashboard;