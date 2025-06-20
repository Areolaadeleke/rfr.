import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Loader from './Loader';

const RepaymentManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repaymentAmount, setRepaymentAmount] = useState("");

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("repayment_status", "active")
      .order("next_repayment_due_date", { ascending: true });

    if (error) {
      console.error("Error fetching loans:", error);
    } else {
      setLoans(data);
    }
    setLoading(false);
  };

  const handleSelectLoan = (loan) => {
    setSelectedLoan(loan);
    setRepaymentAmount("");
  };

  const handleRepaymentSubmit = async () => {
    if (!repaymentAmount || isNaN(repaymentAmount)) {
      alert("Please enter a valid repayment amount");
      return;
    }

    const amountToAdd = parseFloat(repaymentAmount);
    const newAmountRepaid = (selectedLoan.amount_repaid || 0) + amountToAdd;
    const isCompleted = newAmountRepaid >= selectedLoan.amount;

    // Calculate next repayment due date (e.g., add 1 month)
    const nextDueDate = new Date(selectedLoan.next_repayment_due_date);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    const { error } = await supabase
      .from("loan_requests")
      .update({
        amount_repaid: newAmountRepaid,
        next_repayment_due_date: isCompleted ? null : nextDueDate.toISOString(),
        repayment_status: isCompleted ? "completed" : "active",
      })
      .eq("id", selectedLoan.id);

    if (error) {
      alert("Failed to update repayment: " + error.message);
    } else {
      alert("Repayment recorded!");
      setSelectedLoan(null);
      fetchActiveLoans();
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800">Loan Repayment Management</h2>

            <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-5 text-indigo-700 border-b pb-2">Active Loans</h3>
                {loans.length === 0 ? (
                <p className="text-center text-gray-500 italic">No active loans found.</p>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse text-gray-700">
                    <thead>
                        <tr className="bg-indigo-100 border-b border-indigo-300">
                        <th className="py-3 px-4 text-left font-semibold">Name</th>
                        <th className="py-3 px-4 text-left font-semibold">Total Amount</th>
                        <th className="py-3 px-4 text-left font-semibold">Amount Repaid</th>
                        <th className="py-3 px-4 text-left font-semibold">Next Due Date</th>
                        <th className="py-3 px-4 text-left font-semibold">Status</th>
                        <th className="py-3 px-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                        <tr
                            key={loan.id}
                            className="border-b border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
                            onClick={() => handleSelectLoan(loan)}
                        >
                            <td className="py-3 px-4">{loan.name || "N/A"}</td>
                            <td className="py-3 px-4 font-mono">₦{parseFloat(loan.amount).toFixed(2)}</td>
                            <td className="py-3 px-4 font-mono">₦{parseFloat(loan.amount_repaid || 0).toFixed(2)}</td>
                            <td className="py-3 px-4">
                            {loan.next_repayment_due_date
                                ? new Date(loan.next_repayment_due_date).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-3 px-4 capitalize font-semibold text-indigo-600">{loan.repayment_status}</td>
                            <td className="py-3 px-4">
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                handleSelectLoan(loan);
                                }}
                                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Record Repayment
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </section>

            {selectedLoan && (
                <section className="p-6 bg-indigo-50 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold mb-5 text-indigo-800">
                    Record Repayment for <span className="italic">{selectedLoan.name}</span>
                </h3>
                <label className="block mb-4">
                    <span className="font-semibold text-gray-700">Repayment Amount (₦):</span>
                    <input
                    type="number"
                    step="0.01"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
                    className="mt-2 block w-full border border-indigo-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </label>
                <div className="flex space-x-4">
                    <button
                    onClick={handleRepaymentSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                    Submit Repayment
                    </button>
                    <button
                    onClick={() => setSelectedLoan(null)}
                    className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                    Cancel
                    </button>
                </div>
                </section>
            )}
        </div>

  );
};

export default RepaymentManagement;
