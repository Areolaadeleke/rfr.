import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import Loader from './Loader';
import LeaveStatsChart from "./LeaveStatsChart";
import LeaveTimeline from "./LeaveTimeline";
import { LEAVE_STATUS } from './Constants';
import Footer from './Footer';

export default function HrDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedReasons, setExpandedReasons] = useState({});
  const [disabled, setDisabled] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leave_requests')
      .select(`
        id, name, email, start_date, end_date, reason, status,
        profiles (role, email), created_at
      `)
      .order(sortField, { ascending: sortOrder === 'asc' })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    setLoading(false);
    if (error) toast.error('Fetch error: ' + error.message);
    else setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, [page, sortField, sortOrder, statusFilter, searchTerm]);

  const filteredRequests = requests.filter(req => {
    const searchText = searchTerm.toLowerCase();
    return (
      (req.name?.toLowerCase().includes(searchText) || req.email?.toLowerCase().includes(searchText)) &&
      (!statusFilter || req.status === statusFilter) &&
      (!roleFilter || req.profiles?.role === roleFilter)
    );
  });

  const statusColors = {
    [LEAVE_STATUS.APPROVED]: 'text-green-600',
    [LEAVE_STATUS.REJECTED]: 'text-red-600',
    [LEAVE_STATUS.PENDING]: 'text-yellow-600',
  };

  const toggleReason = (id) => {
    setExpandedReasons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkUpdateStatus = async (newStatus) => {
    if (selectedIds.length === 0) return toast.info('No requests selected.');
    setDisabled(true);
    for (const id of selectedIds) {
      await updateStatus(id, newStatus, false);
    }
    toast.success(`Bulk updated ${selectedIds.length} to ${newStatus}.`);
    setSelectedIds([]);
    await fetchRequests();
    setDisabled(false);
  };

  const handleSort = (field) => {
    if (field === sortField) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sendEmailToStaff = async (request, newStatus) => {
    if (!request.email) return toast.error('No email for staff.');
    const emailData = {
      email: request.email,
      name: request.name,
      status: newStatus,
      start_date: request.start_date,
      end_date: request.end_date,
      reason: request.reason,
      role: request.profiles?.role || 'N/A',
      submission_date: new Date().toLocaleString(),
      status_color:
        newStatus === LEAVE_STATUS.APPROVED
          ? 'green'
          : newStatus === LEAVE_STATUS.REJECTED
          ? 'red'
          : 'black',
    };
    try {
      await emailjs.send('service_r9dh2rv', 'template_dl2beu8', emailData, 'tUEnM5jWC3FPhXbtw');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const updateStatus = async (id, newStatus, fetch = true) => {
    setDisabled(true);
    const request = requests.find(r => r.id === id);
    if (!request) {
      setDisabled(false);
      return;
    }

    const { error } = await supabase
      .from('leave_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      await sendEmailToStaff(request, newStatus);
      toast.success(`Status updated to ${newStatus}`);

      // Update local state immediately for better UX
      setRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
      );

      if (fetch) await fetchRequests();
    }
    setDisabled(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white px-8 py-4 shadow-md w-full">
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8 space-y-8 overflow-auto w-full max-w-full">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <input
            type="text"
            placeholder="Search by name/email"
            className="px-4 py-3 border rounded shadow-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-3 border rounded shadow-sm w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value={LEAVE_STATUS.APPROVED}>Approved</option>
            <option value={LEAVE_STATUS.PENDING}>Pending</option>
            <option value={LEAVE_STATUS.REJECTED}>Rejected</option>
          </select>
          <select
            className="px-4 py-3 border rounded shadow-sm w-full"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 disabled:bg-green-300"
              onClick={() => bulkUpdateStatus(LEAVE_STATUS.APPROVED)}
              disabled={selectedIds.length === 0 || disabled}
            >
              Approve Selected
            </button>
            <button
              className="bg-red-600 text-white px-6 py-3 rounded shadow hover:bg-red-700 disabled:bg-red-300"
              onClick={() => bulkUpdateStatus(LEAVE_STATUS.REJECTED)}
              disabled={selectedIds.length === 0 || disabled}
            >
              Reject Selected
            </button>
          </div>
        </div>

        {/* Leave Stats & Timeline */}
        <div className="w-full px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1600px] mx-auto">
            <div className="w-full">
              <LeaveStatsChart requests={requests} />
            </div>
            <div className="w-full">
              <LeaveTimeline requests={requests} />
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full">
          {loading ? (
            <Loader />
          ) : filteredRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No requests found.</p>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3"></th>
                      {['name', 'email', 'start_date', 'end_date', 'status', 'created_at'].map((field) => (
                        <th
                          key={field}
                          className="cursor-pointer px-4 py-3 text-left whitespace-nowrap"
                          onClick={() => handleSort(field)}
                        >
                          {field.replace('_', ' ').toUpperCase()}
                          {sortField === field && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left">Reason</th>
                      {/* <th className="px-4 py-3 text-left">Role</th> */}
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(req.id)}
                            onChange={() => toggleSelect(req.id)}
                            className="cursor-pointer"
                            disabled={disabled}
                          />
                        </td>
                        <td className="px-4 py-3">{req.name}</td>
                        <td className="px-4 py-3">{req.email}</td>
                        <td className="px-4 py-3">{req.start_date}</td>
                        <td className="px-4 py-3">{req.end_date}</td>
                        <td className={`px-4 py-3 font-semibold ${statusColors[req.status]}`}>{req.status}</td>
                        <td className="px-4 py-3">{new Date(req.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3 max-w-xs break-words">
                          {expandedReasons[req.id]
                            ? req.reason
                            : req.reason.length > 30
                              ? req.reason.slice(0, 30) + '...'
                              : req.reason}
                          {req.reason.length > 30 && (
                            <button
                              onClick={() => toggleReason(req.id)}
                              className="text-blue-600 ml-2 text-xs underline"
                            >
                              See {expandedReasons[req.id] ? 'less' : 'more'}
                            </button>
                          )}
                        </td>
                        {/* <td className="px-4 py-3">{req.profiles?.role}</td> */}
                        <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => updateStatus(req.id, LEAVE_STATUS.APPROVED)}
                            disabled={disabled}
                            className={`px-3 py-1 text-xs rounded text-white ${
                              disabled ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(req.id, LEAVE_STATUS.REJECTED)}
                            disabled={disabled}
                            className={`px-3 py-1 text-xs rounded text-white ${
                              disabled ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE VIEW */}
              <div className="sm:hidden space-y-4">
                {filteredRequests.map((req) => (
                  <div key={req.id} className="border p-4 rounded-md shadow-sm bg-gray-50">
                    <div className="text-sm text-gray-700 font-semibold mb-1">{req.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{req.email}</div>
                    <div className="text-xs mb-1">
                      Dates: {req.start_date} to {req.end_date}
                    </div>
                    <div className={`mb-1 font-semibold ${statusColors[req.status]}`}>
                      Status: {req.status}
                    </div>
                    <div className="mb-1 text-xs">
                      Submitted: {new Date(req.created_at).toLocaleString()}
                    </div>
                    <div className="mb-2 text-xs max-w-full break-words">
                      Reason: {expandedReasons[req.id]
                        ? req.reason
                        : req.reason.length > 30
                          ? req.reason.slice(0, 30) + '...'
                          : req.reason}
                      {req.reason.length > 30 && (
                        <button
                          onClick={() => toggleReason(req.id)}
                          className="text-blue-600 ml-1 underline text-xs"
                        >
                          See {expandedReasons[req.id] ? 'less' : 'more'}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(req.id, LEAVE_STATUS.APPROVED)}
                        disabled={disabled}
                        className={`flex-grow px-4 py-2 text-xs rounded text-white ${
                          disabled ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, LEAVE_STATUS.REJECTED)}
                        disabled={disabled}
                        className={`flex-grow px-4 py-2 text-xs rounded text-white ${
                          disabled ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || disabled}
            className="px-4 py-2 rounded bg-gray-200 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={disabled}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </main>

      <footer>
         <Footer />
      </footer>
    </div>
  );
}
