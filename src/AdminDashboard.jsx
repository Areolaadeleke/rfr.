import { useState } from "react";
//import StaffList from "./StaffList";
import Footer from "./Footer";
import AdminHeader from "./AdminHeader";
import VoucherList from "./VoucherList";
import StaffTable from "./StaffTable";
import PayrollTable from "./PayrollTable";


function AdminDashboard({ users }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("pettycash");

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
    </main>

    <Footer />
  </div>
);

}

export default AdminDashboard;