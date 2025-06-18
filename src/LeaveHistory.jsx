import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Loader from './Loader';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (!error) setLeaves(data);
      setLoading(false);
    };

    fetchLeaves();
  }, []);

  return (
   <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Leave Request History</h3>

        {loading ? (
            <p className="text-gray-600"><Loader /></p>
        ) : leaves.length === 0 ? (
            <p className="text-gray-600">No leave requests found.</p>
        ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leaves.map((leave) => (
                <li
                key={leave.id}
                className="border border-gray-200 rounded-lg p-5 bg-white shadow hover:shadow-md transition-shadow"
                >
                <div className="mb-2">
                    <span className="font-medium text-gray-700">Type:</span>{" "}
                    <span className="text-gray-900">{leave.leave_type}</span>
                </div>
                <div className="mb-2">
                    <span className="font-medium text-gray-700">Reason:</span>{" "}
                    <span className="text-gray-900">{leave.reason}</span>
                </div>
                <div className="mb-2">
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                    className={`font-semibold ${
                        leave.status === "pending"
                        ? "text-yellow-600"
                        : leave.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                    >
                    {leave.status}
                    </span>
                </div>
                <div className="mb-1">
                    <span className="font-medium text-gray-700">From:</span>{" "}
                    <span className="text-gray-900">{leave.start_date}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">To:</span>{" "}
                    <span className="text-gray-900">{leave.end_date}</span>
                </div>
                </li>
              ))}
            </ul>
        )}
        </div>

  );
};

export default LeaveHistory;