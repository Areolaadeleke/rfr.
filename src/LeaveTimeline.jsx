import React, { useEffect, useState } from "react";
import { supabase } from './supabaseClient';

const LeaveTimeline = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching timeline", error);
        return;
      }

      setLeaveRequests(data);
    };

    fetchRequests();
  }, []);

  return (
  <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md mt-6 w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto">
  <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
    📅 Leave Timeline
  </h2>

  {leaveRequests.length === 0 ? (
    <p className="text-center text-gray-500 text-sm">No leave requests yet.</p>
  ) : (
    <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {leaveRequests.map((req, index) => (
        <li
          key={index}
          className="border-l-4 border-blue-500 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm relative"
        >
          <span className="absolute -left-1.5 top-4 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white"></span>

          <div className="text-xs text-gray-400 mb-1 sm:mb-2">
            {new Date(req.created_at).toLocaleString()}
          </div>

          <div className="text-gray-700">
            <p className="text-sm font-medium mb-1">
              <span className="font-semibold">{req.profiles?.name}</span> requested{" "}
              <span className="italic">{req.leave_type}</span> leave
            </p>

            <span
              className={`inline-block text-xs font-semibold px-2 py-1 rounded-md ${
                req.status === "approved"
                  ? "bg-green-100 text-green-600"
                  : req.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>



  );
};

export default LeaveTimeline;