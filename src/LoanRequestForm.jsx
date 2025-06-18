import { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';

const LoanRequestForm = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const amountInputRef = useRef(null);

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  const validateForm = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid loan amount.');
      return false;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the loan.');
      return false;
    }
    if (!loanTerm || isNaN(loanTerm) || parseInt(loanTerm) <= 0) {
      setError('Please enter a valid loan term (months).');
      return false;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!name) {
      setError('Please enter your name.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    const user = (await supabase.auth.getUser()).data.user;

    const { error: insertError } = await supabase.from('loan_requests').insert([
      {
        user_id: user.id,
        amount: parseFloat(amount),
        reason,
        loan_term_months: parseInt(loanTerm),
        name,
        phone: phone.trim(),
        email: email.trim(),
        additional_notes: additionalNotes,
        status: 'pending',
        request_date: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error(insertError);
      setMessage(`Something went wrong: ${insertError.message}`);
    } else {
      setMessage('Loan request submitted successfully!');
      setError('');
      // reset form fields
      setAmount('');
      setReason('');
      setLoanTerm('');
      setPhone('');
      setEmail('');
      setName('');
      setAdditionalNotes('');
    }

    setLoading(false);
  };

  return (
  <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-200">
    <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Request a Loan</h2>

    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</div>}
    {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300">{message}</div>}

    <form onSubmit={handleSubmit} className="space-y-6">
      
      <label htmlFor="loanTerm" className="block font-semibold text-gray-700">
        Name
      </label>
      <input
        id="name"
        type="text"
        value={name}
        min="1"
        onChange={(e) => setName(e.target.value)}
        placeholder="enter full name"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Loan Amount */}
      <label htmlFor="amount" className="block font-semibold text-gray-700">
        Loan Amount
      </label>
      <input
        id="amount"
        type="number"
        value={amount}
        min="1"
        step="0.01"
        ref={amountInputRef}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Loan Amount"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Reason */}
      <label htmlFor="reason" className="block font-semibold text-gray-700">
        Reason for Loan
      </label>
      <textarea
        id="reason"
        value={reason}
        maxLength={300}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for loan"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows={4}
      />
      <div className="text-sm text-gray-500 text-right">{reason.length}/300 characters</div>

      {/* Loan Term */}
      <label htmlFor="loanTerm" className="block font-semibold text-gray-700">
        Loan Term (months)
      </label>
      <input
        id="loanTerm"
        type="number"
        value={loanTerm}
        min="1"
        onChange={(e) => setLoanTerm(e.target.value)}
        placeholder="e.g. 12"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

     

      

      {/* Phone */}
      <label htmlFor="phone" className="block font-semibold text-gray-700">
        Phone Number
      </label>
      <input
        id="phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Your phone number"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Email */}
      <label htmlFor="email" className="block font-semibold text-gray-700">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

    

      {/* Additional Notes */}
      <label htmlFor="additionalNotes" className="block font-semibold text-gray-700">
        Additional Notes (optional)
      </label>
      <textarea
        id="additionalNotes"
        value={additionalNotes}
        onChange={(e) => setAdditionalNotes(e.target.value)}
        placeholder="Any extra information"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows={3}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Submitting...' : 'Submit Loan Request'}
      </button>
    </form>
  </div>
);

};

export default LoanRequestForm;
