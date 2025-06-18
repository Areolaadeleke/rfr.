import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PayrollForm() {
  const [formData, setFormData] = useState({
    staff_no: '',
    employee_name: '',
    designation: '',
    payroll_month: '',
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

  const inputClasses = "border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const btnPrimaryClasses = "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const formattedMonth = formData.payroll_month
    ? `${formData.payroll_month}-01`
    : null;

  const dataToInsert = {
    staff_no: formData.staff_no,
    employee_name: formData.employee_name,
    designation: formData.designation,
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

  console.log('Submitting payroll data:', dataToInsert); // ✅ this should now log

  const { error } = await supabase.from('payroll_records').insert([dataToInsert]);

  if (error) {
    console.error('Insert error:', error);
    toast.error('❌ Error adding record: ' + error.message);
  } else {
    toast.success('✅ Payroll record added successfully!');
  }
};



  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="staff_no"
          value={formData.staff_no}
          onChange={handleChange}
          placeholder="Staff No"
          className={inputClasses}
          required
        />
        <input
          name="employee_name"
          value={formData.employee_name}
          onChange={handleChange}
          placeholder="Employee Name"
          className={inputClasses}
          required
        />
        <input
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Designation"
          className={inputClasses}
          required
        />
        <input
          type="month"
          name="payroll_month"
          value={formData.payroll_month}
          onChange={handleChange}
          className={inputClasses}
          required
        />
        <input
          name="basic_salary"
          type="number"
          value={formData.basic_salary}
          onChange={handleChange}
          placeholder="Basic Salary"
          className={inputClasses}
          min="0"
          step="0.01"
          required
        />
        <input
          name="transport_allowance"
          type="number"
          value={formData.transport_allowance}
          onChange={handleChange}
          placeholder="Transport Allowance"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="housing_allowance"
          type="number"
          value={formData.housing_allowance}
          onChange={handleChange}
          placeholder="Housing Allowance"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="utilities_allowance"
          type="number"
          value={formData.utilities_allowance}
          onChange={handleChange}
          placeholder="Utilities Allowance"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="meal_allowance"
          type="number"
          value={formData.meal_allowance}
          onChange={handleChange}
          placeholder="Meal Allowance"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="medical_allowance"
          type="number"
          value={formData.medical_allowance}
          onChange={handleChange}
          placeholder="Medical Allowance"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="paye"
          type="number"
          value={formData.paye}
          onChange={handleChange}
          placeholder="PAYE"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="employee_pension"
          type="number"
          value={formData.employee_pension}
          onChange={handleChange}
          placeholder="Employee Pension"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="staff_deduction"
          type="number"
          value={formData.staff_deduction}
          onChange={handleChange}
          placeholder="Staff Deduction"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="salary_advance"
          type="number"
          value={formData.salary_advance}
          onChange={handleChange}
          placeholder="Salary Advance"
          className={inputClasses}
          min="0"
          step="0.01"
        />
        <input
          name="staff_welfare_deduction"
          type="number"
          value={formData.staff_welfare_deduction}
          onChange={handleChange}
          placeholder="Welfare Deduction"
          className={inputClasses}
          min="0"
          step="0.01"
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className={btnPrimaryClasses}>Submit</button>
      </div>
    </form>
  );
}
