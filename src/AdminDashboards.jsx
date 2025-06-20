import React from "react";
import DashboardCards from "./DashboardCards";         
//import LeaveRequests from "./LeaveRequests";          
//import LoanRequests from "./LoanRequests";             
import UserManagement from "./UserManagement";       
import NotificationsPanel from "./NotificationsPanel";
import TestNotifications from "./TestNotifications";
import AdminNotifications from "./AdminNotifications";

const AdminDashboards = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage leave, loans, users, and more.</p>
        
      </div>

      {/* Summary Cards */}
      <DashboardCards />

      
      {/* <TestNotifications /> */}

      {/* Requests Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeaveRequests />
        <LoanRequests />
      </div> */}

      {/* User Management */}
      <UserManagement />
    </div>
  );
};

export default AdminDashboards;
