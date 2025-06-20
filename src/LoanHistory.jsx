import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Loader from './Loader';
import RepayLoanPaystack from './RepayLoanPaystack';

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      const { data, error } = await supabase
        .from('loan_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('request_date', { ascending: false });

      if (!error) setLoans(data);
      setLoading(false);
    };

    fetchLoans();
  }, []);

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-16 max-w-screen-xl mx-auto">
  <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800 text-center sm:text-left">
    Loan Request History
  </h3>

  {loading ? (
    <Loader />
  ) : loans.length === 0 ? (
    <p className="text-gray-500 text-center">No loan requests found.</p>
  ) : (
    <ul className="space-y-8">
      {loans.map((loan) => (
        <li
          key={loan.id}
          className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm sm:text-base text-gray-700">
            <p>
              <span className="font-medium text-gray-900">Amount:</span>{' '}
              ₦{loan.amount.toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-gray-900">Reason:</span>{' '}
              {loan.reason}
            </p>
            <p>
              <span className="font-medium text-gray-900">Status:</span>{' '}
              <span
                className={
                  loan.status === 'pending'
                    ? 'text-red-600 font-semibold'
                    : 'text-green-600 font-semibold'
                }
              >
                {loan.status}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-900">Date:</span>{' '}
              {new Date(loan.request_date).toLocaleDateString()}
            </p>

            {loan.admin_comment && (
              <p className="sm:col-span-2 lg:col-span-4">
                <span className="font-medium text-gray-900">Admin Comment:</span>{' '}
                {loan.admin_comment}
              </p>
            )}

            {loan.status === 'pending' && (
              <div className="sm:col-span-2 lg:col-span-4">
                <RepayLoanPaystack loan={loan} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default LoanHistory;
