import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Loader from './Loader';

const AdminLoanHistory = () => {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);

      // Since your table is `loan_requests` and name/email are in it directly
      const { data, error } = await supabase
        .from("loan_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching loans:", error);
        setLoading(false);
        return;
      }

      setLoanData(data);
      setLoading(false);
    };

    fetchLoans();
  }, []);

  if (loading) return <Loader />;
  if (!loanData.length) return <p className="text-center mt-10 text-gray-500">No loan history found.</p>;

  // Group by name or email from loan_requests table
  const loansByStaff = loanData.reduce((acc, loan) => {
    const staffName = loan.name || loan.email || "Unknown Staff";
    if (!acc[staffName]) acc[staffName] = [];
    acc[staffName].push(loan);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">📋 Loan History by Staff</h2>

      {Object.entries(loansByStaff).map(([staff, loans]) => (
       <div key={staff} className="mb-12 bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-indigo-700 mb-6 border-b pb-2">{staff}</h3>
            <ul className="space-y-4">
                {loans.map((loan) => (
                <li
                    key={loan.id}
                    className="bg-white border border-gray-100 rounded-md p-4 shadow-sm hover:shadow-md transition duration-200"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="mb-2 sm:mb-0 space-y-1.5">
                        <p className="text-sm text-gray-800 flex items-center gap-1">
                            <span className="font-semibold">💰 Amount:</span>
                            <span className="text-gray-900">₦{parseFloat(loan.amount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                        </p>
                        <p className="text-sm text-gray-800 flex items-center gap-1">
                            <span className="font-semibold">📝 Purpose:</span>
                            <span className="text-gray-700">{loan.reason || "N/A"}</span>
                        </p>
                        <p className="text-sm text-gray-800 flex items-center gap-1">
                            <span className="font-semibold">📅 Requested On:</span>
                            <span className="text-gray-700">{new Date(loan.created_at).toLocaleDateString("en-NG", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </p>
                    </div>

                    <div className="mt-2 sm:mt-0">
                        <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            loan.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : loan.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                        >
                        {loan.status?.charAt(0).toUpperCase() + loan.status?.slice(1)}
                        </span>
                    </div>
                    </div>
                </li>
                ))}
            </ul>
        </div>

      ))}
    </div>
  );
};

export default AdminLoanHistory;
