import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Loader from './Loader';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, roles")
      .order("name");

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (user) => {
    setEditingUser(user);
    setNewRole(user.roles || "");
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setNewRole("");
  };

  const saveRole = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from("profiles")
      .update({ roles: newRole })
      .eq("id", editingUser.id);

    if (error) {
      alert("Error updating role: " + error.message);
      return;
    }

    setEditingUser(null);
    setNewRole("");
    fetchUsers();
  };

  if (loading) return <Loader />
  if (users.length === 0) return <p>No users found.</p>;

  return (
   <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
    👥 User Management
  </h2>

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
        <tr>
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Email</th>
          <th className="py-3 px-4">Role</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-t border-gray-200 hover:bg-gray-50 transition"
          >
            <td className="py-3 px-4 text-gray-800">{user.name || "—"}</td>
            <td className="py-3 px-4 text-gray-800">{user.email}</td>
            <td className="py-3 px-4 text-gray-800">
              {editingUser?.id === user.id ? (
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              ) : (
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                  {user.roles || "N/A"}
                </span>
              )}
            </td>
            <td className="py-3 px-4">
              {editingUser?.id === user.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveRole}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(user)}
                  className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                >
                  Edit Role
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default UserManagement;
