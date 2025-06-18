import { useState } from 'react';
import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';

export default function CreatePayrollModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    payroll_month: '',
    staff_no: '',
    employee_name: '',
    designation: '',
    basic_salary: '',
    transport_allowance: '',
    housing_allowance: '',
    utilities_allowance: '',
    meal_allowance: '',
    medical_allowance: '',
    paye: '',
    employee_pension: '',
    staff_deduction: '',
    salary_advance: '',
    staff_welfare_deduction: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const calculateTotals = () => {
    const gross = [
      Number(formData.basic_salary) || 0,
      Number(formData.transport_allowance) || 0,
      Number(formData.housing_allowance) || 0,
      Number(formData.utilities_allowance) || 0,
      Number(formData.meal_allowance) || 0,
      Number(formData.medical_allowance) || 0,
    ].reduce((sum, val) => sum + val, 0);

    const deductions = [
      Number(formData.paye) || 0,
      Number(formData.employee_pension) || 0,
      Number(formData.staff_deduction) || 0,
      Number(formData.salary_advance) || 0,
      Number(formData.staff_welfare_deduction) || 0,
    ].reduce((sum, val) => sum + val, 0);

    return {
      gross_salary: gross,
      total_deductions: deductions,
      net_salary: gross - deductions,
    };
  };

  const handleSubmit = async () => {
    const { gross_salary, total_deductions, net_salary } = calculateTotals();

    const formattedMonth = formData.payroll_month
      ? `${formData.payroll_month}-01`
      : null;

    const insertPayload = {
      ...formData,
      payroll_month: formattedMonth,
      basic_salary: Number(formData.basic_salary) || 0,
      transport_allowance: Number(formData.transport_allowance) || 0,
      housing_allowance: Number(formData.housing_allowance) || 0,
      utilities_allowance: Number(formData.utilities_allowance) || 0,
      meal_allowance: Number(formData.meal_allowance) || 0,
      medical_allowance: Number(formData.medical_allowance) || 0,
      paye: Number(formData.paye) || 0,
      employee_pension: Number(formData.employee_pension) || 0,
      staff_deduction: Number(formData.staff_deduction) || 0,
      salary_advance: Number(formData.salary_advance) || 0,
      staff_welfare_deduction: Number(formData.staff_welfare_deduction) || 0,
    };

    // Remove computed fields
    delete insertPayload.gross_salary;
    delete insertPayload.total_deductions;
    delete insertPayload.net_salary;

    const { error } = await supabase
      .from('payroll_records')
      .insert([insertPayload]);

    if (!error) {
      toast.success('Payroll record created successfully!');
      onCreated();
      onClose();
    } else {
      console.error(error);
      toast.error('Error: ' + error.message);
    }
  };

  const { gross_salary, total_deductions, net_salary } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 w-full max-w-3xl rounded-lg shadow-lg space-y-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-gray-900">Create Payroll Record</h2>

       <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                    { name: 'payroll_month', type: 'month', placeholder: 'Payroll Month' },
                    { name: 'staff_no', type: 'text', placeholder: 'Staff No' },
                    { name: 'employee_name', type: 'text', placeholder: 'Employee Name' },
                    { name: 'designation', type: 'text', placeholder: 'Designation' },
                    { name: 'basic_salary', type: 'number', placeholder: 'Basic Salary' },
                    { name: 'transport_allowance', type: 'number', placeholder: 'Transport Allowance' },
                    { name: 'housing_allowance', type: 'number', placeholder: 'Housing Allowance' },
                    { name: 'utilities_allowance', type: 'number', placeholder: 'Utilities Allowance' },
                    { name: 'meal_allowance', type: 'number', placeholder: 'Meal Allowance' },
                    { name: 'medical_allowance', type: 'number', placeholder: 'Medical Allowance' },
                    { name: 'paye', type: 'number', placeholder: 'PAYE' },
                    { name: 'employee_pension', type: 'number', placeholder: 'Employee Pension' },
                    { name: 'staff_deduction', type: 'number', placeholder: 'Staff Deduction' },
                    { name: 'salary_advance', type: 'number', placeholder: 'Salary Advance' },
                    { name: 'staff_welfare_deduction', type: 'number', placeholder: 'Staff Welfare Deduction' },
                ].map(({ name, type, placeholder }) => (
                    <input
                    key={name}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={handleChange}
                    // fallback to empty string for controlled input value
                    value={formData[name] === undefined || formData[name] === null ? '' : formData[name]}
                    className="border border-gray-300 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm"
                    />
                ))}

                {/* Salary Summary */}
                <div className="col-span-1 sm:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
                    <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Gross Salary:</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(gross_salary)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Total Deductions:</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(total_deductions)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Net Salary:</span>
                    <span className="text-green-600 font-bold">{formatCurrency(net_salary)}</span>
                    </div>
                </div>
        </form>


        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
