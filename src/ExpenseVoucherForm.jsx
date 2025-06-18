import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';

export default function ExpenseVoucherForm({ closeModal, initialData }) {
  const emptyForm = {
    date: '',
    company_name: '',
    service_type: '',
    amount: '',
    total_expenses: '',
    comments: '',
    concerned_person: '',
    details: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error on field change
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.company_name) newErrors.company_name = 'Company name is required';
    if (!form.amount) newErrors.amount = 'Amount is required';
    if (!form.total_expenses) newErrors.total_expenses = 'Total expenses is required';
    if (!form.concerned_person) newErrors.concerned_person = 'Concerned person is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    let error;

    if (initialData?.id) {
      // UPDATE
      const { error: updateError } = await supabase
        .from('expense_vouchers')
        .update(form)
        .eq('id', initialData.id);

      error = updateError;
    } else {
      // INSERT
      const { error: insertError } = await supabase
        .from('expense_vouchers')
        .insert([form]);

      error = insertError;
    }

    if (error) {
      toast.error('Error: ' + error.message);
    } else {
      toast.success(`Voucher ${initialData?.id ? 'updated' : 'submitted'} successfully!`);
      closeModal(); // close the modal and refresh list
    }
  };

  const handleReset = () => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${
              errors.date ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            placeholder="Date"
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div>
          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${
              errors.company_name ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            placeholder="Company Name"
          />
          {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
        </div>

        <input
          name="service_type"
          value={form.service_type}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Service Type"
        />

        <div>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${
              errors.amount ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            placeholder="Amount"
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>

        <div>
          <input
            name="total_expenses"
            type="number"
            value={form.total_expenses}
            onChange={handleChange}
            className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${
              errors.total_expenses ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            placeholder="Total Expenses"
          />
          {errors.total_expenses && <p className="text-red-500 text-xs mt-1">{errors.total_expenses}</p>}
        </div>

        <div>
          <input
            name="concerned_person"
            value={form.concerned_person}
            onChange={handleChange}
            className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${
              errors.concerned_person ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            placeholder="Concerned Person"
          />
          {errors.concerned_person && <p className="text-red-500 text-xs mt-1">{errors.concerned_person}</p>}
        </div>
      </div>

      <textarea
        name="details"
        value={form.details}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Expense/Payment Details"
        rows="4"
      />

      <textarea
        name="comments"
        value={form.comments}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Comments"
        rows="3"
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition duration-200"
        >
          {initialData ? 'Update Voucher' : 'Submit Voucher'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded transition duration-200"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={closeModal}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
