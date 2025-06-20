import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const PAGE_SIZE = 5;

const AdminLoanDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminComment, setAdminComment] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin by fetching role from profiles table
  useEffect(() => {
    const checkRole = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching role:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.role === 'admin');
      }
    };

    checkRole();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchTotalCount();
      fetchLoans();
    }
  }, [isAdmin, page, searchTerm]);

  const fetchTotalCount = async () => {
    let query = supabase
      .from('loan_requests')
      .select('id', { count: 'exact', head: true });

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,reason.ilike.%${searchTerm}%`
      );
    }

    const { count, error } = await query;
    if (error) {
      console.error('Error fetching total count:', error);
      setTotalCount(0);
    } else {
      setTotalCount(count || 0);
    }
  };

  const fetchLoans = async () => {
    setLoading(true);
    let query = supabase
      .from('loan_requests')
      .select('*')
      .order('request_date', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,reason.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching loans:', error);
      setLoans([]);
    } else {
      setLoans(data);
    }
    setLoading(false);
  };

  const handleLoanAction = async (loanId, newStatus) => {
    const comment = adminComment[loanId] || '';

    const { data, error } = await supabase
      .from('loan_requests')
      .update({
        status: newStatus,
        admin_comment: comment,
        decision_date: new Date().toISOString(),
      })
      .eq('id', loanId);

    if (error) {
      console.error('Update error:', error);
      alert(`Failed to ${newStatus} loan: ${error.message}`);
    } else {
      alert(`Loan ${newStatus} successfully`);
      fetchLoans();
      fetchTotalCount();
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Access denied. This page is for admins only.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan Dashboard</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or reason..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1); // Reset to first page on search
            setSearchTerm(e.target.value);
          }}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          aria-label="Search loan requests by name or reason"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading loan requests...</p>
      ) : loans.length === 0 ? (
        <p className="text-gray-500">No loan requests found.</p>
      ) : (
        <>
          <ul className="space-y-8">
            {loans.map((loan) => (
              <li
                key={loan.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-800 text-sm sm:text-base">
                  <p className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">Name:</span>
                    <span className="truncate">{loan.name || '—'}</span>
                  </p>

                  <p className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">Amount:</span>
                    <span className="text-indigo-600 font-medium">
                      ₦{Number(loan.amount).toLocaleString()}
                    </span>
                  </p>

                  <p className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">Status:</span>
                    <span
                      className={`capitalize font-semibold ${
                        loan.status === 'pending'
                          ? 'text-yellow-600'
                          : loan.status === 'approved'
                          ? 'text-green-600'
                          : loan.status === 'paid'
                          ? 'text-blue-600'
                          : 'text-red-600'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </p>

                  <p className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">Date:</span>
                    <span>{new Date(loan.request_date).toLocaleDateString()}</span>
                  </p>

                  <p className="sm:col-span-2 lg:col-span-4 mt-4 leading-relaxed">
                    <span className="font-semibold text-gray-900">Reason:</span>{' '}
                    <span className="text-gray-700">{loan.reason || 'N/A'}</span>
                  </p>

                  {loan.additional_notes && (
                    <p className="sm:col-span-2 lg:col-span-4 mt-2 italic text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">Notes:</span>{' '}
                      <span>{loan.additional_notes}</span>
                    </p>
                  )}
                </div>

                {loan.status === 'pending' && (
                  <div className="mt-6 space-y-4">
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-3 resize-none shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                      transition duration-200"
                      placeholder="Admin comment (optional)"
                      value={adminComment[loan.id] || ''}
                      onChange={(e) =>
                        setAdminComment((prev) => ({
                          ...prev,
                          [loan.id]: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                    <div className="flex gap-4 justify-end">
                      <button
                        onClick={() => handleLoanAction(loan.id, 'approved')}
                        className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md
                        hover:bg-green-700 focus:ring-4 focus:ring-green-300
                        transition duration-200"
                        aria-label={`Approve loan request for ${loan.name}`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleLoanAction(loan.id, 'rejected')}
                        className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md
                        hover:bg-red-700 focus:ring-4 focus:ring-red-300
                        transition duration-200"
                        aria-label={`Reject loan request for ${loan.name}`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {loan.admin_comment && loan.status !== 'pending' && (
                  <p className="mt-4 text-sm text-gray-600 italic border-t border-gray-200 pt-3">
                    <strong>Admin Comment:</strong> {loan.admin_comment}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md shadow-md ${
                page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700 self-center">
              Page {page} of {Math.ceil(totalCount / PAGE_SIZE) || 1}
            </span>

            <button
              onClick={() =>
                setPage((p) =>
                  p < Math.ceil(totalCount / PAGE_SIZE) ? p + 1 : p
                )
              }
              disabled={page >= Math.ceil(totalCount / PAGE_SIZE)}
              className={`px-4 py-2 rounded-md shadow-md ${
                page >= Math.ceil(totalCount / PAGE_SIZE)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLoanDashboard;
