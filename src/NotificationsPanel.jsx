import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const PAGE_SIZE = 5; // Number of notifications to fetch per page

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

 const fetchNotifications = async (pageNum = 1, append = false) => {
  setLoading(true);
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  
  if (!user) {
    console.log('No user logged in');
    setNotifications([]);
    setLoading(false);
    return;
  }
  
  const userId = user.id;
  console.log('Fetching notifications for userId:', userId);

  const from = (pageNum - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  console.log('Supabase response:', { data, error, count });

  if (error) {
    console.error('Error fetching notifications:', error);
    setNotifications([]);
    setHasMore(false);
  } else {
    setNotifications((prev) => (append ? [...prev, ...data] : data));
    setHasMore(count > to + 1);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchNotifications(page);

    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotif = payload.new;
          supabase.auth.getUser().then(({ data }) => {
            if (newNotif.user_id === data.user.id) {
              // Refresh notifications
              fetchNotifications(1);
              setPage(1);
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      alert('Failed to mark as read: ' + error.message);
    } else {
      fetchNotifications(page);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      alert('Failed to mark all as read: ' + error.message);
    } else {
      fetchNotifications(1);
      setPage(1);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);

    if (error) {
      alert('Failed to delete notification: ' + error.message);
    } else {
      fetchNotifications(page);
    }
  };

  // Load more notifications
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  if (loading && notifications.length === 0) return <p>Loading notifications...</p>;

  if (notifications.length === 0)
    return <p className="text-gray-500">No notifications.</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button
          onClick={markAllAsRead}
          disabled={notifications.every((n) => n.is_read)}
          className={`text-sm px-3 py-1 rounded ${
            notifications.every((n) => n.is_read)
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:underline'
          }`}
        >
          Mark all as read
        </button>
      </div>

      <ul>
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-3 mb-2 rounded flex justify-between items-start ${
              notif.is_read
                ? 'bg-gray-100 text-gray-600'
                : notif.type === 'success'
                ? 'bg-green-100 text-green-800'
                : notif.type === 'error'
                ? 'bg-red-100 text-red-800'
                : notif.type === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            <div className="flex-1 flex items-center space-x-2">
              {!notif.is_read && (
                <span className="inline-block w-3 h-3 rounded-full bg-blue-600" title="Unread"></span>
              )}
              <p>{notif.message}</p>
            </div>

            <div className="flex flex-col ml-4 space-y-1 text-xs">
              {!notif.is_read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-blue-600 hover:underline"
                  aria-label="Mark notification as read"
                >
                  Mark as read
                </button>
              )}
              <button
                onClick={() => deleteNotification(notif.id)}
                className="text-red-600 hover:underline"
                aria-label="Delete notification"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="text-blue-600 hover:underline text-sm"
            aria-label="Load more notifications"
          >
            Load more...
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
