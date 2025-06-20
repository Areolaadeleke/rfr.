import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Loader from './Loader';

const AdminLeaveHistory = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leave requests:", error);
        setLoading(false);
        return;
      }

      setLeaveData(data);
      setLoading(false);
    };

    fetchLeaveRequests();
  }, []);

  if (loading) return <Loader />;
  if (!leaveData.length) return <p className="text-center mt-10 text-gray-500">No leave history found.</p>;

  // Group by staff name or email
  const groupedLeaves = leaveData.reduce((acc, leave) => {
    const key = leave.name || leave.email || "Unknown Staff";
    if (!acc[key]) acc[key] = [];
    acc[key].push(leave);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">🗓️ Leave History by Staff</h2>

      {Object.entries(groupedLeaves).map(([staff, leaves]) => (
        <div key={staff} className="mb-12 bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-indigo-700 mb-6 border-b pb-2">{staff}</h3>
          <ul className="space-y-4">
            {leaves.map((leave) => (
              <li
                key={leave.id}
                className="bg-white border border-gray-100 rounded-md p-4 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-2 sm:mb-0 space-y-1.5">
                    <p className="text-sm text-gray-800 flex gap-1">
                      <span className="font-semibold">📄 Type:</span>
                      <span className="text-gray-700">{leave.leave_type}</span>
                    </p>
                    <p className="text-sm text-gray-800 flex gap-1">
                      <span className="font-semibold">📝 Reason:</span>
                      <span className="text-gray-700">{leave.reason || "N/A"}</span>
                    </p>
                    <p className="text-sm text-gray-800 flex gap-1">
                      <span className="font-semibold">📅 Requested On:</span>
                      <span className="text-gray-700">{new Date(leave.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        leave.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1)}
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

export default AdminLeaveHistory;
