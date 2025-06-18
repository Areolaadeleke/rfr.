import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import ExpenseVoucherForm from './ExpenseVoucherForm';
import { toast } from 'react-toastify';

const companyLogos = {
  OpenAI: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/OpenAI_Logo.svg',
  Google: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  Apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  // Add more logos here as needed
};

export default function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchVouchers = async () => {
    const { data, error } = await supabase
      .from('expense_vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) toast.error(error);
    else setVouchers(data);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleFormSubmit = () => {
    setShowModal(false);
    setSelectedVoucher(null);
    fetchVouchers();
  };

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setShowModal(true);
  };

  const openConfirm = (id) => {
  setDeleteId(id);
  setShowConfirm(true);
  };

  // const handleDelete = async (id) => {
  //   if (confirm('Are you sure you want to delete this voucher?')) {
  //     const { error } = await supabase.from('expense_vouchers').delete().eq('id', id);
  //     if (error) alert('Error deleting voucher: ' + error.message);
  //     else {
  //       alert('Voucher deleted!');
  //       fetchVouchers();
  //     }
  //   }
  // };


  const confirmDelete = async () => {
  setShowConfirm(false);
  const { error } = await supabase.from('expense_vouchers').delete().eq('id', deleteId);
  if (error) {
    
    toast.error('Error deleting voucher:', error.message);
  } else {
    
    fetchVouchers();
  }
  };


  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExport = (voucher) => {
    const content = `
          Date: ${voucher.date}
          Company: ${voucher.company_name}
          Service: ${voucher.service_type}
          Amount: ₦${voucher.amount}
          Total Expenses: ₦${voucher.total_expenses}
          Concerned Person: ${voucher.concerned_person}
          Details: ${voucher.details}
          Comments: ${voucher.comments}
              `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `voucher-${voucher.id}.txt`;
    link.click();
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Expense Vouchers</h2>
        <button
          onClick={() => {
            setSelectedVoucher(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Voucher
        </button>
      </div>

      <div className="space-y-8 p-4 sm:p-6 md:p-10">
        {vouchers.map((v) => {
          const logo = companyLogos[v.company_name];
          const isExpanded = expandedItems[v.id];

          return (
            <div
              key={v.id}
              className="bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {logo && (
                    <img
                      src={logo}
                      alt={`${v.company_name} logo`}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">{v.company_name}</h3>
                    <p className="text-sm text-gray-500">Service: {v.service_type}</p>
                  </div>
                </div>

                <div className="text-right sm:text-left text-sm text-gray-600">
                  <p>
                    Date: <span className="font-medium">{v.date}</span>
                  </p>
                  <p>
                    Person: <span className="font-medium">{v.concerned_person}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 border-t pt-4">
                <p>
                  <span className="font-medium text-gray-600">Amount:</span> ₦
                  {Number(v.amount).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Total Expenses:</span> ₦
                  {Number(v.total_expenses).toLocaleString()}
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {isExpanded ? (
                  <>
                    {v.details && (
                      <>
                        <h4 className="font-semibold text-gray-700">Details:</h4>
                        <p>{v.details}</p>
                      </>
                    )}
                    {v.comments && (
                      <>
                        <h4 className="font-semibold text-gray-700">Comments:</h4>
                        <p>{v.comments}</p>
                      </>
                    )}
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => toggleExpanded(v.id)}
                    >
                      Show less ▲
                    </button>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-2">{v.comments}</p>
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => toggleExpanded(v.id)}
                    >
                      Show more ▼
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-between items-center mt-6 border-t pt-4 text-sm">
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    onClick={() => handleEdit(v)}
                  >
                    Edit
                  </button>
                  {/* <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    onClick={() => handleDelete(v.id)}
                  >
                    Delete
                  </button> */}

                  <button onClick={() => openConfirm(v.id)} className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'>Delete</button>
                </div>
                <button
                  onClick={() => handleExport(v)}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition"
                >
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-30 bg-gray-100/30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white max-w-3xl w-full rounded shadow p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedVoucher(null);
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>
            <ExpenseVoucherForm initialData={selectedVoucher} closeModal={handleFormSubmit} />
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-30 bg-gray-100/30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-md max-w-sm">
            <p>Are you sure you want to delete this voucher?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
