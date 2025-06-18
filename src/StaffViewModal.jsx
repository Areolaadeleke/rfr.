export default function StaffViewModal({ staff, isOpen, onClose }) {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white max-w-3xl w-full p-8 rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl font-bold leading-none focus:outline-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Staff Details</h2>

            <div className="space-y-8 text-gray-700 text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {[
                { label: 'Full Name', value: staff.full_name },
                { label: 'Email', value: staff.email },
                { label: 'Phone', value: staff.phone || '—' },
                { label: 'Position', value: staff.position || '—' },
                { label: 'Department', value: staff.department || '—' },
                { label: 'Address', value: staff.address || '—' },
                { label: 'Date of Birth', value: staff.date_of_birth || '—' },
                { label: 'Salary', value: staff.salary ? `₦${staff.salary.toLocaleString()}` : '—' },
                ].map(({ label, value }) => (
                <div key={label} className="flex flex-col bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                    <span className="font-semibold text-gray-900 mb-1">{label}</span>
                    <span className="text-gray-800">{value}</span>
                </div>
                ))}
            </div>

           {staff.photo_url && (
                <div className="mt-8">
                    <strong className="block font-semibold text-gray-900 text-lg mb-3">Profile Photo:</strong>
                    <div className="w-44 h-44 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <img
                        src={staff.photo_url}
                        alt="Staff Photo"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    </div>
                </div>
            )}


            {staff.document_urls && staff.document_urls.length > 0 && (
                <div className="mt-8">
                    <strong className="block font-semibold text-gray-900 text-lg mb-3">Uploaded Documents:</strong>
                    <ul className="list-disc list-inside space-y-2 text-blue-700 max-w-md">
                    {staff.document_urls.map((url, index) => (
                        <li key={index} className="hover:text-blue-900 transition-colors duration-200">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Document {index + 1}
                        </a>
                        </li>
                    ))}
                    </ul>
                </div>
            )}

            </div>

      </div>
    </div>
  );
}
