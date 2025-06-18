import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';
import PayslipModal from './PayslipModal';
import CreatePayrollModal from './CreatePayrollModal';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-toastify';

function ConfirmDeleteModal({ visible, onConfirm, onCancel }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">Are you sure you want to delete this payroll record?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PayrollTable() {
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState('');
  const [viewRecord, setViewRecord] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  // For delete confirmation modal
  const [recordToDelete, setRecordToDelete] = useState(null);

  const fetchRecords = async (selectedMonth) => {
    let query = supabase.from('payroll_records').select('*');

    if (selectedMonth) {
      const startDate = selectedMonth + '-01';
      const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1))
        .toISOString()
        .slice(0, 10);
      query = query.gte('payroll_month', startDate).lt('payroll_month', endDate);
    }

    const { data, error } = await query.order('id', { ascending: false });
    if (data) setRecords(data);
    if (error) toast.error('Error fetching payrolls: ' + error.message);
  };

  useEffect(() => {
    fetchRecords(month);
  }, [month]);

  const handleView = (record) => setViewRecord(record);
  const handleClose = () => setViewRecord(null);

  // Open modal on delete button click
  const confirmDelete = (record) => setRecordToDelete(record);

  // Cancel deletion
  const cancelDelete = () => setRecordToDelete(null);

  // Perform deletion after confirm
  const performDelete = async () => {
    if (!recordToDelete) return;

    const { error } = await supabase.from('payroll_records').delete().eq('id', recordToDelete.id);
    if (!error) {
      toast.success('Payroll record deleted');
      setRecords((prev) => prev.filter((rec) => rec.id !== recordToDelete.id));
      setRecordToDelete(null);
    } else {
      toast.error('Failed to delete record: ' + error.message);
    }
  };

 const handleExcelUpload = async (e) => {
  const file = e.target.files?.[0];  // safely access first file
  if (!file) {
    toast.error('No file selected');
    return;
  }

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);

    const { error } = await supabase.from('payroll_records').insert(json);
    if (!error) {
      toast.success('✅ Bulk payroll import successful!');
      fetchRecords(month);
    } else {
      toast.error('❌ ' + error.message);
    }
  } catch (err) {
    toast.error('Error reading file: ' + err.message);
  }
};

  const totalGross = records.reduce((sum, rec) => sum + (rec.gross_salary || 0), 0);
  const totalNet = records.reduce((sum, rec) => sum + (rec.net_salary || 0), 0);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Payroll Records</h2>

        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            + Create Payroll
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 border">Staff No</th>
              <th className="px-2 py-2 border">Name</th>
              <th className="px-2 py-2 border">Designation</th>
              <th className="px-2 py-2 border">Gross Salary</th>
              <th className="px-2 py-2 border">Deductions</th>
              <th className="px-2 py-2 border">Net Salary</th>
              <th className="px-2 py-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="text-center">
                <td className="border px-2 py-1">{record.staff_no}</td>
                <td className="border px-2 py-1">{record.employee_name}</td>
                <td className="border px-2 py-1">{record.designation}</td>
                <td className="border px-2 py-1">₦{record.gross_salary?.toLocaleString()}</td>
                <td className="border px-2 py-1">₦{record.total_deductions?.toLocaleString()}</td>
                <td className="border px-2 py-1 font-semibold">₦{record.net_salary?.toLocaleString()}</td>


                <td className="border px-2 py-1 flex justify-center gap-2">
                  <button
                    onClick={() => handleView(record)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => confirmDelete(record)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td colSpan={3} className="text-right px-2 py-2">Total</td>
              <td className="border px-2 py-2">₦{totalGross.toLocaleString()}</td>
              <td></td>
              <td className="border px-2 py-2">₦{totalNet.toLocaleString()}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {viewRecord && <PayslipModal record={viewRecord} onClose={handleClose} />}
      {showCreate && (
        <CreatePayrollModal
          onClose={() => setShowCreate(false)}
          onCreated={() => fetchRecords(month)}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        visible={!!recordToDelete}
        onConfirm={performDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
