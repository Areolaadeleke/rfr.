import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const RepayLoanPaystack = ({ loan }) => {
  console.log('Paystack key:', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY);

  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAndRepayments = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user || null);

      const { data: repaymentData } = await supabase
        .from('loan_repayments')
        .select('*')
        .eq('loan_id', loan.id);

      setRepayments(repaymentData || []);
      setLoading(false);
    };

    getUserAndRepayments();
  }, [loan.id]);

  const totalRepaid = repayments.reduce((sum, r) => sum + Number(r.amount), 0);
  const remaining = loan.amount - totalRepaid;
  const percentage = Math.min((totalRepaid / loan.amount) * 100, 100).toFixed(1);

  const handleSuccess = async (reference) => {
    const { error } = await supabase.from('loan_repayments').insert([
      {
        loan_id: loan.id,
        user_id: user.id,
        amount: Number(amount),
        repayment_date: new Date().toISOString(),
        reference: reference.reference,
      },
    ]);

    if (error) {
      alert('Error saving repayment');
    } else {
      alert('Repayment successful!');
      setAmount('');
      const { data: updatedRepayments } = await supabase
        .from('loan_repayments')
        .select('*')
        .eq('loan_id', loan.id);
      setRepayments(updatedRepayments);
    }
  };

  const payWithPaystack = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!user?.email) {
      alert('User not loaded yet.');
      return;
    }

    const handler = window.PaystackPop?.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: Number(amount) * 100, // amount in kobo
      currency: 'NGN',
      ref: new Date().getTime().toString(),
      callback: function (response) {
        handleSuccess(response);
      },
      onClose: function () {
        alert('Payment cancelled');
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      alert('Paystack SDK not loaded.');
    }
  };

  return (
    <div className="border rounded p-4 bg-white mt-6 shadow-md">
      <h3 className="font-bold text-lg mb-2">Repay Loan</h3>

      {loading ? (
        <p>Loading repayment info...</p>
      ) : (
        <>
          <p><strong>Loan Amount:</strong> ₦{loan.amount}</p>
          <p><strong>Total Repaid:</strong> ₦{totalRepaid}</p>
          <p><strong>Remaining:</strong> ₦{remaining}</p>

          <div className="w-full bg-gray-200 rounded h-4 mt-2 mb-4">
            <div
              className="bg-green-600 h-4 rounded"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">{percentage}% repaid</p>

          <input
            type="number"
            placeholder="Enter amount to repay"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />
          <button
            onClick={payWithPaystack}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Pay with Paystack
          </button>
        </>
      )}
    </div>
  );
};

export default RepayLoanPaystack;
