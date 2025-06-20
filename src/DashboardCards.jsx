import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const DashboardCards = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [pendingLoans, setPendingLoans] = useState(0);
  const [overdueRepayments, setOverdueRepayments] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const [
        { count: empCount },
        { count: leavesCount },
        { count: loansCount },
        { count: overdueCount },
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("leave_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("loan_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("loan_requests")
          .select("id", { count: "exact", head: true })
          .lt("repayment_due_date", new Date().toISOString())
          .neq("status", "repaid"),
      ]);

      setTotalEmployees(empCount || 0);
      setPendingLeaves(leavesCount || 0);
      setPendingLoans(loansCount || 0);
      setOverdueRepayments(overdueCount || 0);
    };

    fetchCounts();
  }, []);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard title="Total Employees" value={totalEmployees} icon="👥" color="bg-indigo-600" />
      <SummaryCard title="Pending Leaves" value={pendingLeaves} icon="📅" color="bg-yellow-500" />
      <SummaryCard title="Pending Loans" value={pendingLoans} icon="💸" color="bg-blue-500" />
      <SummaryCard title="Overdue Loans" value={overdueRepayments} icon="⚠️" color="bg-red-600" />
    </section>
  );
};

const SummaryCard = ({ title, value, icon, color }) => (
  <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-4">
    <div className={`w-12 h-12 flex items-center justify-center text-white rounded-full ${color} text-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default DashboardCards;
