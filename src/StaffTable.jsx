import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import StaffProfileForm from './StaffProfileForm';

import StaffViewModal from './StaffViewModal';
import StaffModal from './StaffModal';

export default function StaffTable() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchStaff = async () => {
    const { data, error } = await supabase.from('staff_profiles').select('*');
    if (!error) {
      setStaff(data);
      setFilteredStaff(data);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    let filtered = [...staff];

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter((s) => s.department === departmentFilter);
    }

    if (positionFilter) {
      filtered = filtered.filter((s) => s.position === positionFilter);
    }

    setFilteredStaff(filtered);
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, positionFilter, staff]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this staff?')) {
      await supabase.from('staff_profiles').delete().eq('id', id);
      fetchStaff();
    }
  };

  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const departments = [...new Set(staff.map((s) => s.department))];
  const positions = [...new Set(staff.map((s) => s.position))];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Staff Directory</h2>
        <button
          onClick={() => {
            setSelectedStaff(null);
            setIsCreating(true);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Staff
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Filter by Department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Filter by Position</option>
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearchTerm('');
            setDepartmentFilter('');
            setPositionFilter('');
          }}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Position</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">DOB</th>
              <th className="p-2 border">Salary</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.full_name}</td>
                <td className="p-2 border">{s.email}</td>
                <td className="p-2 border">{s.phone}</td>
                <td className="p-2 border">{s.position}</td>
                <td className="p-2 border">{s.department}</td>
                <td className="p-2 border">{s.address || '-'}</td>
                <td className="p-2 border">{s.date_of_birth|| '-'}</td>
                <td className="p-2 border">₦{s.salary || '0'}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200 hover:text-green-800 transition"
                    onClick={() => {
                      setViewStaff(s);
                      setIsViewModalOpen(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 hover:text-blue-800 transition"
                    onClick={() => {
                      setSelectedStaff(s);
                      setIsCreating(false);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded hover:bg-red-200 hover:text-red-800 transition"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredStaff.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredStaff.length / itemsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage >= Math.ceil(filteredStaff.length / itemsPerPage)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit/Create Modal */}
    <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setSelectedStaff(null);
        }}
        existingStaff={selectedStaff} // null for create, object for edit
        onComplete={() => {
            setIsModalOpen(false);
            setSelectedStaff(null);
            fetchStaff(); // Refresh the table
        }}
    />



      {/* View Modal */}
      <StaffViewModal
        staff={viewStaff}
        isOpen={isViewModalOpen}
        onClose={() => {
            setIsViewModalOpen(false);
            setViewStaff(null);
        }}
      />

    </div>
  );
}