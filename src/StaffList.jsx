import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
//import Header from './Header';
import Loader from './Loader';
import Footer from './Footer';

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedStaff, setSelectedStaff] = useState(null);


  useEffect(() => {
    async function fetchStaff() {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) {
        console.error('Error fetching staff:', error.message);
      } else {
        setStaff(data);
        setFilteredStaff(data);
      }
      setLoading(false);
    }

    fetchStaff();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = staff.filter((person) =>
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchTerm, staff]);

  // Handle sorting
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    const sorted = [...filteredStaff].sort((a, b) => {
      if (!a[key]) return 1;
      if (!b[key]) return -1;

      const aVal = a[key].toString().toLowerCase();
      const bVal = b[key].toString().toLowerCase();

      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    setSortConfig({ key, direction });
    setFilteredStaff(sorted);
  };

  useEffect(() => {
  async function fetchStaff() {
    const { data, error } = await supabase.from('staff').select('*');
    console.log("Fetched data:", data);
    if (error) {
      console.error('Error fetching staff:', error.message);
    } else {
      setStaff(data);
      setFilteredStaff(data);
    }
    setLoading(false);
  }

  fetchStaff();
}, []);


  if (loading) return <div className="p-4"><Loader /></div>;

 return (
        <div className="flex flex-col min-h-screen">
          {/* Fixed header: Title + Search */}
        <div
          className="
            bg-white z-40 border-b border-gray-200
            px-4 py-4
            flex flex-col sm:flex-row sm:items-center sm:justify-between
            gap-3 sm:gap-0
            relative
          "
        >
          <h2 className="text-xl sm:text-2xl font-semibold">Staff Directory</h2>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      w-full sm:w-64"
          />
        </div>



          {/* Main content with padding top to avoid overlap with fixed header */}
          <main className="flex-grow pt-20 p-6 overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 shadow-sm rounded text-sm sm:text-base hidden sm:table">
                <thead className="bg-gray-100 text-left sticky top-0 z-30">
                  <tr>
                    <th className="py-4 px-3 border-b bg-gray-100">Image</th>
                    <th onClick={() => handleSort('name')} className="py-4 px-3 border-b cursor-pointer bg-gray-100">Name</th>
                    <th onClick={() => handleSort('email')} className="py-4 px-3 border-b cursor-pointer bg-gray-100">Email</th>
                    <th className="py-4 px-3 border-b bg-gray-100">Department</th>
                    <th className="py-4 px-3 border-b bg-gray-100">Position</th>
                    <th className="py-4 px-3 border-b bg-gray-100">Contact</th>
                    <th className="py-4 px-3 border-b bg-gray-100">Location</th>
                    <th className="py-4 px-3 border-b bg-gray-100">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((person) => (
                    <tr
                      key={person.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedStaff(person)}
                    >
                      <td className="py-4 px-3 border-b">
                        <img
                          src={person.image_url || 'https://via.placeholder.com/50'}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="py-4 px-3 border-b">{person.name}</td>
                      <td className="py-4 px-3 border-b">{person.email}</td>
                      <td className="py-4 px-3 border-b">{person.department}</td>
                      <td className="py-4 px-3 border-b">{person.position}</td>
                      <td className="py-4 px-3 border-b">{person.contact}</td>
                      <td className="py-4 px-3 border-b">{person.location}</td>
                      <td className="py-4 px-3 border-b">
                        {new Date(person.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>


              {/* Mobile stacked layout */}
              <div className="sm:hidden space-y-4">
                {filteredStaff.map((person) => (
                  <div
                    key={person.id}
                    className="border border-gray-200 rounded p-4 shadow-sm"
                    onClick={() => setSelectedStaff(person)}
                  >
                    <p>
                      <span className="font-semibold">Name:</span> {person.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {person.email}
                    </p>
                    <p>
                      <span className="font-semibold">Department:</span> {person.department}
                    </p>
                    <p>
                      <span className="font-semibold">Position:</span> {person.position}
                    </p>
                    <p>
                      <span className="font-semibold">Contact:</span> {person.contact}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {person.location}
                    </p>
                    <p>
                      <span className="font-semibold">Joined:</span>{' '}
                      {new Date(person.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}

                {filteredStaff.length === 0 && (
                  <p className="text-center text-gray-500">No staff found.</p>
                )}
              </div>
            </div>

            {/* Selected staff modal - unchanged */}
            {selectedStaff && (
              <>
                {/* Overlay: blurs and dims background */}
                <div
                  className="fixed inset-0 backdrop-blur-sm z-30"
                  onClick={() => setSelectedStaff(null)}
                ></div>

                {/* Modal content */}
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                      onClick={() => setSelectedStaff(null)}
                      aria-label="Close modal"
                    >
                      ✕
                    </button>

                    <img
                      src={selectedStaff.image_url || 'https://via.placeholder.com/150'}
                      alt={selectedStaff.name}
                      className="w-48 h-48 rounded-xl mx-auto mb-4 object-cover"
                    />
                    <h2 className="text-2xl font-bold mb-2 text-center">{selectedStaff.name}</h2>
                    <p>
                      <strong>Email:</strong> {selectedStaff.email}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedStaff.department || 'N/A'}
                    </p>
                    <p>
                      <strong>Position:</strong> {selectedStaff.position || 'N/A'}
                    </p>
                    <p>
                      <strong>Contact:</strong> {selectedStaff.contact || 'N/A'}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedStaff.location || 'N/A'}
                    </p>
                    <p>
                      <strong>Joined:</strong>{' '}
                      {new Date(selectedStaff.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      );

}

export default StaffList;
