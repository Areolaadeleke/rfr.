
// import React, { useState } from "react";
// import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
// import './calendar-custom.css'; 

// const CompanyCalendar = () => {
//   const [date, setDate] = useState(new Date());

//   const events = {
//     '2025-06-18': 'HR Meeting',
//     '2025-06-21': 'Company Holiday',
//     '2025-06-25': 'Team Building Day',
//   };

//   const selectedDateKey = date.toISOString().split('T')[0];
//   const selectedEvent = events[selectedDateKey];

//   return (
//     <div className="p-6 bg-white rounded shadow-md w-full max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">📅 Company Calendar</h2>

//       <Calendar
//         onChange={setDate}
//         value={date}
//         tileClassName={({ date }) => {
//           const dateStr = date.toISOString().split('T')[0];
//           return events[dateStr] ? 'highlight-event' : null;
//         }}
//         className="react-calendar w-full"
//       />

//       <div className="mt-6">
//         <h3 className="text-xl font-semibold">Selected Date:</h3>
//         <p>{date.toDateString()}</p>
//         {selectedEvent ? (
//           <p className="text-green-600 font-medium mt-1">Event: {selectedEvent}</p>
//         ) : (
//           <p className="text-gray-500 italic mt-1">No event on this day</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompanyCalendar;