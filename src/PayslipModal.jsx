export default function PayslipModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payslip - {record.employee_name}</h2>
            
            <div className="space-y-2 text-gray-800">
            <p><strong>Month:</strong> {record.payroll_month}</p>
            <p><strong>Staff No:</strong> {record.staff_no}</p>
            <p><strong>Designation:</strong> {record.designation}</p>

            <hr className="my-3" />

            <p><strong>Basic Salary:</strong> ₦{record.basic_salary}</p>
            <p><strong>Transport Allowance:</strong> ₦{record.transport_allowance}</p>
            <p><strong>Housing Allowance:</strong> ₦{record.housing_allowance}</p>
            <p><strong>Utilities:</strong> ₦{record.utilities_allowance}</p>
            <p><strong>Meal:</strong> ₦{record.meal_allowance}</p>
            <p><strong>Medical:</strong> ₦{record.medical_allowance}</p>
            <p className="mt-2 font-semibold text-gray-900">Gross: ₦{record.gross_salary}</p>

            <hr className="my-3" />

            <p><strong>PAYE:</strong> ₦{record.paye}</p>
            <p><strong>Pension:</strong> ₦{record.employee_pension}</p>
            <p><strong>Staff Deduction:</strong> ₦{record.staff_deduction}</p>
            <p><strong>Salary Advance:</strong> ₦{record.salary_advance}</p>
            <p><strong>Welfare Deduction:</strong> ₦{record.staff_welfare_deduction}</p>
            <p className="mt-2 font-semibold text-gray-900">Total Deduction: ₦{record.total_deductions}</p>

            <hr className="my-3" />

            <p className="text-green-600 font-bold text-lg">Net Salary: ₦{record.net_salary}</p>
            </div>

            <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-700 hover:bg-gray-800 transition text-white py-2 rounded-md font-medium"
            >
            Close
            </button>
        </div>
    </div>


  );
}