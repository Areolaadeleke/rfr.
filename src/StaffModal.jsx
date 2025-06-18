import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

export default function StaffModal({ isOpen, onClose, existingStaff, onComplete }) {
  const isEdit = Boolean(existingStaff);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    address: '',
    date_of_birth: '',
    salary: '',
    photo_url: '',
    document_urls: [],
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  // Error messages for file validation & upload
  const [photoError, setPhotoError] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (existingStaff) {
      setForm({
        ...existingStaff,
        photo_url: existingStaff.photo_url || '',
        document_urls: existingStaff.document_urls || [],
      });
    } else {
      setForm({
        full_name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        address: '',
        date_of_birth: '',
        salary: '',
        photo_url: '',
        document_urls: [],
      });
      setPhotoFile(null);
      setDocumentFiles([]);
      setPhotoError('');
      setDocumentError('');
      setSubmitError('');
    }
  }, [existingStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Drag & drop handlers for photo
  const handlePhotoDrop = useCallback((e) => {
    e.preventDefault();
    setPhotoError('');
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Only image files are allowed for the profile photo.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setPhotoError('Image file size must be less than 5MB.');
      return;
    }
    setPhotoFile(file);
  }, []);

  // Drag & drop handlers for documents
  const handleDocumentsDrop = useCallback((e) => {
    e.preventDefault();
    setDocumentError('');
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > MAX_DOC_SIZE) {
        setDocumentError('Each document file size must be less than 10MB.');
        return;
      }
    }
    setDocumentFiles(files);
  }, []);

  // Prevent default drag over behavior
  const handleDragOver = (e) => e.preventDefault();

  // Handle file input change for photo
  const handlePhotoChange = (e) => {
    setPhotoError('');
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Only image files are allowed for the profile photo.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setPhotoError('Image file size must be less than 5MB.');
      return;
    }
    setPhotoFile(file);
  };

  // Handle file input change for documents
  const handleDocumentsChange = (e) => {
    setDocumentError('');
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (file.size > MAX_DOC_SIZE) {
        setDocumentError('Each document file size must be less than 10MB.');
        return;
      }
    }
    setDocumentFiles(files);
  };

 const uploadFile = async (file, pathPrefix) => {
  const fileName = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  const { data, error } = await supabase.storage
    .from('staff-documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type, // <-- Important to prevent 400 errors
    });

  if (error) {
    console.error('Upload error:', error.message); // <-- This will help debug
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('staff-documents')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError('');
  setLoading(true);

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error('User not authenticated');

    let photoUrl = form.photo_url;
    let documentUrls = [...form.document_urls];

    if (photoFile) {
      photoUrl = await uploadFile(photoFile, 'photos');
    }

    for (const file of documentFiles) {
      const url = await uploadFile(file, 'documents');
      documentUrls.push(url);
    }

    const profileData = {
      ...form,
      photo_url: photoUrl,
      document_urls: documentUrls,
      user_id: user.id, // ✅ Needed for RLS policies
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase
        .from('staff_profiles')
        .update(profileData)
        .eq('id', form.id));
    } else {
      ({ error } = await supabase
        .from('staff_profiles')
        .insert([profileData]));
    }

    if (error) throw error;

    onComplete();
  } catch (err) {
    setSubmitError(err.message || 'Failed to save staff profile.');
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this staff profile?');
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase
      .from('staff_profiles')
      .delete()
      .eq('id', form.id);
    setLoading(false);

    if (error) {
      setSubmitError('Delete failed: ' + error.message);
    } else {
      onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4 w-full">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? 'Edit Staff' : 'Create Staff'}
        </h2>

       <form
  onSubmit={handleSubmit}
  className="bg-white rounded shadow-md p-6 mx-auto
             max-w-7xl w-full
             sm:p-10
             space-y-6"
>
  {/* Inputs grid for larger screens */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[ 
      { name: 'full_name', label: 'Full Name' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' },
      { name: 'position', label: 'Position' },
      { name: 'department', label: 'Department' },
      { name: 'address', label: 'Address' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
      { name: 'salary', label: 'Salary', type: 'number' },
    ].map(({ name, label, type = 'text' }) => (
      <div key={name} className="flex flex-col">
        <label htmlFor={name} className="mb-1 font-semibold text-gray-700">{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          value={form[name] || ''}
          onChange={handleChange}
          placeholder={label}
          className="border border-gray-300 rounded-md px-4 py-3
                     focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent
                     transition"
          required={name === 'full_name' || name === 'email'}
        />
      </div>
    ))}
  </div>

  {/* Profile Photo upload */}
  <div>
    <label className="block mb-3 font-semibold text-gray-700">Profile Photo</label>

    {form.photo_url && !photoFile && (
      <img
        src={form.photo_url}
        alt="Current profile"
        className="w-28 h-28 object-cover rounded-md mb-4 border border-gray-300"
      />
    )}

    <div
      onDrop={handlePhotoDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('photoInput').click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          document.getElementById('photoInput').click();
        }
      }}
      className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer select-none transition-colors
                 ${photoError ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'}`}
    >
      {photoFile ? (
        <p className="text-gray-800 font-medium">
          {photoFile.name} <span className="text-gray-500 text-sm">({(photoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
        </p>
      ) : (
        <p className="text-gray-500">Drag & drop photo here, or click to select</p>
      )}
    </div>

    <input
      id="photoInput"
      type="file"
      accept="image/*"
      onChange={handlePhotoChange}
      className="hidden"
    />

    {photoError && <p className="text-red-700 text-sm mt-3">{photoError}</p>}
  </div>

  {/* Documents upload */}
  <div>
    <label className="block mb-3 font-semibold text-gray-700">Supporting Documents</label>

    {form.document_urls.length > 0 && documentFiles.length === 0 && (
      <ul className="mb-4 list-disc list-inside max-h-28 overflow-y-auto text-blue-700 underline">
        {form.document_urls.map((url, i) => (
          <li key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-900">
              Document {i + 1}
            </a>
          </li>
        ))}
      </ul>
    )}

    <div
      onDrop={handleDocumentsDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('documentsInput').click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          document.getElementById('documentsInput').click();
        }
      }}
      className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer select-none transition-colors
                 ${documentError ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'}`}
    >
      {documentFiles.length > 0 ? (
        <ul className="text-sm text-gray-700 space-y-1 max-h-36 overflow-auto w-full px-3">
          {documentFiles.map((f) => (
            <li key={f.name} className="truncate">
              {f.name} <span className="text-gray-500 text-xs">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">Drag & drop documents here, or click to select (multiple files allowed)</p>
      )}
    </div>

    <input
      id="documentsInput"
      type="file"
      multiple
      onChange={handleDocumentsChange}
      className="hidden"
    />

    {documentError && <p className="text-red-700 text-sm mt-3">{documentError}</p>}
  </div>

  {/* Buttons */}
  <div className="flex flex-col md:flex-row md:justify-between gap-6 mt-8">
    <button
      type="submit"
      disabled={loading || photoError || documentError}
      className="bg-blue-700 text-white px-8 py-3 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition w-full md:w-auto"
    >
      {loading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'}
    </button>

    {isEdit && (
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-700 text-white px-8 py-3 rounded-md hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition w-full md:w-auto"
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    )}
  </div>

  {/* Submit error */}
  {submitError && <p className="text-red-700 mt-6 text-center font-semibold">{submitError}</p>}
</form>

      </div>
    </div>
  );
}
