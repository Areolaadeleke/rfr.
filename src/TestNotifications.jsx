import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const TestNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications for logged-in user
  const fetchNotifications = async () => {
    setLoading(true);
    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;

    if (!user) {
      console.log('No user logged in');
      setNotifications([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } else {
      setNotifications(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking as read:', error);
    } else {
      fetchNotifications();
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
    } else {
      fetchNotifications();
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  if (notifications.length === 0) return <p>No notifications found for this user.</p>;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20, border: '1px solid #ccc' }}>
      <h2>Test Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} style={{ marginBottom: 10, background: n.is_read ? '#eee' : '#def', padding: 10 }}>
            <p><strong>Message:</strong> {n.message}</p>
            <p><strong>Read:</strong> {n.is_read ? 'Yes' : 'No'}</p>
            <button onClick={() => markAsRead(n.id)} disabled={n.is_read} style={{ marginRight: 10 }}>
              Mark as Read
            </button>
            <button onClick={() => deleteNotification(n.id)} style={{ color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestNotifications;
