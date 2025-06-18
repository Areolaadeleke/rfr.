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
    <div className="mt-10 px-4 sm:px-6 lg:px-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">Loan Request History</h3>

      {loading ? (
        <Loader />
      ) : loans.length === 0 ? (
        <p className="text-gray-500">No loan requests found.</p>
      ) : (
        <ul className="space-y-6">
          {loans.map((loan) => (
            <li
              key={loan.id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6 text-sm sm:text-base text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Amount:</span> ₦{loan.amount}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Reason:</span> {loan.reason}
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

                {loan.status === 'pending' && <RepayLoanPaystack loan={loan} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoanHistory;
