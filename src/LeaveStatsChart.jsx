import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { supabase } from "./supabaseClient";

ChartJS.register(ArcElement, Tooltip, Legend);

const LeaveStatsChart = () => {
  const [leaveStats, setLeaveStats] = useState({
    typeCount: {},
    statusCount: { approved: 0, rejected: 0, pending: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("reason, status"); // change 'reason' to 'leave_type' if appropriate

      if (error) {
        console.error("Error fetching stats", error);
        return;
      }

      const typeCount = {};
      const statusCount = { approved: 0, rejected: 0, pending: 0 };

      data.forEach((request) => {
        const type = request.reason || "Other"; // fallback if empty
        const status = request.status || "pending";

        typeCount[type] = (typeCount[type] || 0) + 1;
        if (statusCount[status] !== undefined) {
          statusCount[status]++;
        }
      });

      setLeaveStats({ typeCount, statusCount });
    };

    fetchStats();
  }, []);

  const pieData = {
    labels: Object.keys(leaveStats.typeCount),
    datasets: [
      {
        label: "Leave Reasons",
        data: Object.values(leaveStats.typeCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9C27B0",
          "#00ACC1",
        ],
      },
    ],
  };

  return (
   <div className="bg-white p-4 sm:p-6 rounded shadow mt-4 w-full max-w-lg mx-auto">
  <h2 className="text-lg sm:text-xl font-semibold sm:font-bold mb-4 text-center">
    📊 Leave Statistics
  </h2>
  {Object.keys(leaveStats.typeCount).length === 0 ? (
    <p className="text-center text-gray-500">No data available</p>
  ) : (
    <div className="w-full h-64 sm:h-80">
      <Pie data={pieData} />
    </div>
  )}
</div>

  );
};

export default LeaveStatsChart;
