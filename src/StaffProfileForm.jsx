import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function StaffProfileForm({ existingStaff, onComplete }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    address: '',
    dob: '',
    salary: '',
  });
  const [photo, setPhoto] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingStaff) {
      setForm({
        full_name: existingStaff.full_name || '',
        email: existingStaff.email || '',
        phone: existingStaff.phone || '',
        position: existingStaff.position || '',
        department: existingStaff.department || '',
        address: existingStaff.address || '',
        dob: existingStaff.dob || '',
        salary: existingStaff.salary || '',
      });
    }
  }, [existingStaff]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file, pathPrefix) => {
    const fileName = `${pathPrefix}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('staff-documents')
      .upload(fileName, file);

    if (error) throw error;

    return supabase.storage
      .from('staff-documents')
      .getPublicUrl(fileName).data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = existingStaff?.photo_url || null;
      let documentUrls = existingStaff?.document_urls || [];

      if (photo) {
        photoUrl = await uploadFile(photo, 'photos');
      }

      for (let doc of documents) {
        const url = await uploadFile(doc, 'documents');
        documentUrls.push(url);
      }

      const profileData = {
        ...form,
        photo_url: photoUrl,
        document_urls: documentUrls,
      };

      let error;
      if (existingStaff) {
        ({ error } = await supabase
          .from('staff_profiles')
          .update(profileData)
          .eq('id', existingStaff.id));
      } else {
        ({ error } = await supabase
          .from('staff_profiles')
          .insert([profileData]));
      }

      if (error) throw error;

      alert(`Staff profile ${existingStaff ? 'updated' : 'created'} successfully!`);
      onComplete && onComplete();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-2xl">
      <h3 className="text-lg font-semibold">
        {existingStaff ? 'Edit Staff Profile' : 'Create Staff Profile'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Upload Profile Photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Upload Supporting Documents:</label>
        <input
          type="file"
          multiple
          onChange={(e) => setDocuments(Array.from(e.target.files))}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : existingStaff ? 'Update Staff' : 'Create Staff'}
      </button>
    </form>
  );
}