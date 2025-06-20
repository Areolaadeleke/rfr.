// import { useEffect, useState } from 'react';
// import { supabase } from './supabaseClient';

// const AdminNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showPanel, setShowPanel] = useState(false);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('notifications')
//       .select(`
//         *,
//         profiles(id, name)
//       `)
//       .eq('target_role', 'admin')
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Error fetching notifications:', error);
//       alert(`Error fetching notifications: ${error.message}`);
//       setNotifications([]);
//     } else {
//       setNotifications(data);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchNotifications();

//     const subscription = supabase
//       .channel('public:notifications')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'notifications', filter: 'target_role=eq.admin' },
//         () => fetchNotifications()
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, []);

//   const markAsRead = async (id) => {
//     const { error } = await supabase
//       .from('notifications')
//       .update({ is_read: true })
//       .eq('id', id);

//     if (error) {
//       console.error('Error marking as read:', error);
//       alert('Failed to mark notification as read.');
//       return;
//     }
//     fetchNotifications();
//   };

//   const deleteNotification = async (id) => {
//     const { error } = await supabase
//       .from('notifications')
//       .delete()
//       .eq('id', id);

//     if (error) {
//       console.error('Error deleting notification:', error);
//       alert('Failed to delete notification.');
//       return;
//     }
//     fetchNotifications();
//   };

//   const markAllAsRead = async () => {
//     const { error } = await supabase
//       .from('notifications')
//       .update({ is_read: true })
//       .eq('target_role', 'admin')
//       .eq('is_read', false);

//     if (error) {
//       console.error('Error marking all as read:', error);
//       alert('Failed to mark all notifications as read.');
//       return;
//     }
//     fetchNotifications();
//   };

//   // Count unread notifications
//   const unreadCount = notifications.filter(n => !n.is_read).length;

//   return (
//     <div className="relative max-w-3xl mx-auto p-6">
//       {/* Notification button */}
//       <button
//         onClick={() => setShowPanel(!showPanel)}
//         className="relative bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
//         aria-label="Toggle notifications panel"
//       >
//         Notifications
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Notification panel */}
//       {showPanel && (
//         <div className="absolute right-0 mt-2 w-full max-w-md bg-white rounded shadow-lg z-50">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="text-lg font-semibold">Admin Notifications</h2>
//             <button
//               onClick={() => setShowPanel(false)}
//               aria-label="Close notifications panel"
//               className="text-gray-600 hover:text-gray-900 focus:outline-none"
//             >
//               ✕
//             </button>
//           </div>

//           <div className="p-4 max-h-96 overflow-y-auto">
//             {loading ? (
//               <p className="text-gray-500">Loading notifications...</p>
//             ) : notifications.length === 0 ? (
//               <p className="text-gray-500">No notifications found.</p>
//             ) : (
//               <>
//                 <button
//                   onClick={markAllAsRead}
//                   className="mb-4 text-blue-600 hover:underline focus:outline-none"
//                   aria-label="Mark all notifications as read"
//                 >
//                   Mark all as read
//                 </button>
//                 <ul className="divide-y divide-gray-200">
//                 {notifications.map(({ id, message, is_read, created_at, profiles }) => {
//                     const userName = profiles?.name || 'Unknown User';
//                     const updatedMessage = message.replace(
//                     /Loan request ID [\w-]+/,
//                     `Loan request by ${userName}`
//                     );

//                     return (
//                     <li
//                         key={id}
//                         className={`flex justify-between items-center p-4 rounded-md mb-2 shadow-sm transition 
//                         ${
//                             is_read 
//                             ? 'bg-gray-50 hover:bg-gray-100' 
//                             : 'bg-white font-semibold shadow-md hover:shadow-lg'
//                         }`}
//                     >
//                         <div className="max-w-[70%]">
//                         <p className={`${is_read ? 'text-gray-700' : 'text-gray-900'}`}>
//                             {updatedMessage}
//                         </p>
//                         <small className="text-gray-400 text-xs">
//                             {new Date(created_at).toLocaleString()}
//                         </small>
//                         </div>

//                         <div className="flex items-center space-x-4">
//                         {!is_read && (
//                            <button
//                                 onClick={() => markAsRead(id)}
//                                 className="px-3 py-1 text-sm text-green-700 border border-green-500 rounded-md hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 transition font-medium"
//                                 aria-label="Mark notification as read"
//                                 >
//                                 Mark as read
//                          </button>

//                         )}
//                        <button
//                             onClick={() => deleteNotification(id)}
//                             className="px-3 py-1 text-sm text-red-700 border border-red-500 rounded-md hover:bg-red-50 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition font-medium"
//                             aria-label="Delete notification"
//                             >
//                             Delete
//                      </button>

//                         </div>
//                     </li>
//                     );
//                 })}
//                 </ul>

//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminNotifications;




import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select(`*, profiles(id, name)`)
      .eq('target_role', 'admin')
      .order('created_at', { ascending: false });
      

    if (error) {
      console.error('Error fetching notifications:', error);
      alert(`Error fetching notifications: ${error.message}`);
      setNotifications([]);
    } else {
      setNotifications(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: 'target_role=eq.admin',
        },
        fetchNotifications
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    if (!error) fetchNotifications();
  };

  const deleteNotification = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    if (!error) fetchNotifications();
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('target_role', 'admin')
      .eq('is_read', false);
    if (!error) fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded hover:bg-gray-100 transition"
        aria-label="Toggle notifications panel"
      >
        <span role="img" aria-label="bell">
          🔔
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 mt-2 w-96 max-w-sm bg-white rounded shadow-lg z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-base font-semibold">Notifications</h2>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          <div className="p-4 max-h-80 overflow-y-auto">
            {loading ? (
              <p className="text-gray-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500">No notifications found.</p>
            ) : (
              <>
                <button
                  onClick={markAllAsRead}
                  className="mb-3 text-sm text-blue-600 hover:underline focus:outline-none"
                >
                  Mark all as read
                </button>
                <ul className="divide-y divide-gray-200">
                  {notifications.map(({ id, message, is_read, created_at, profiles }) => {
                    const userName = profiles?.name || 'Unknown';
                    const displayMsg = message.replace(/Loan request ID [\w-]+/, `Loan request by ${userName}`);

                    return (
                      <li
                        key={id}
                        className={`py-3 px-3 rounded transition ${
                          is_read ? 'bg-gray-50' : 'bg-white font-medium shadow-sm'
                        }`}
                      >
                        <div className="text-sm text-gray-800">{displayMsg}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(created_at).toLocaleString()}
                        </div>

                        <div className="mt-2 flex gap-2">
                          {!is_read && (
                            <button
                              onClick={() => markAsRead(id)}
                              className="px-2 py-1 text-xs font-medium text-green-700 border border-green-300 rounded hover:bg-green-50 hover:text-green-800 transition"
                            >
                              ✅ Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(id)}
                            className="px-2 py-1 text-xs font-medium text-red-700 border border-red-300 rounded hover:bg-red-50 hover:text-red-800 transition"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
