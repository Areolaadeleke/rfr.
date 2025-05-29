import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';
import { LEAVE_STATUS } from './Constants';



export default function LeaveForm({ user }) {
  const [form, setForm] = useState({
    name:'',
    email:'',
    days_taken:'',
    start_date: '',
    end_date: '',
    reason: '',
    department: '',
    office_location: '',
    date_employed: '',
    employee_id: '',
    resume_date: '',
    reliever_name: '',
    last_working_day: '',
    total_entitlement: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  

const [leaveDays, setLeaveDays] = useState(0);
const [isOverLimit, setIsOverLimit] = useState(false);

useEffect(() => {
  if (form.start_date && form.end_date) {
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    const timeDiff = end - start;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    const totalEnt = parseInt(form.total_entitlement) || 0;
    const alreadyTaken = parseInt(form.days_taken) || 0;

    if (daysDiff > 0) {
      setLeaveDays(daysDiff);
      const remaining = totalEnt - alreadyTaken;
      setIsOverLimit(daysDiff > remaining);
    } else {
      setLeaveDays(0);
      setIsOverLimit(false);
    }
  } else {
    setLeaveDays(0);
    setIsOverLimit(false);
  }
}, [form.start_date, form.end_date, form.total_entitlement, form.days_taken]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from('leave_requests').insert([
      {
        user_id: user.id,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason,
        department: form.department,
        office_location: form.office_location,
        date_employed: form.date_employed,
        employee_id: form.employee_id,
        resume_date: form.resume_date,
        reliever_name: form.reliever_name,
        last_working_day: form.last_working_day,
        total_entitlement: form.total_entitlement,
        status: LEAVE_STATUS.PENDING,
        name: form.name,
        email:form.email,
        days_taken:form.days_taken,
      }
    ]);
    console.log(data)

    if (error) {
      toast.error('Failed to submit: ' + error.message);
    } else {
      toast.success('Leave request submitted!');
      setForm({
        name:'',
        email:'',
        days_taken:'',
        start_date: '',
        end_date: '',
        reason: '',
        department: '',
        office_location: '',
        date_employed: '',
        employee_id: '',
        resume_date: '',
        reliever_name: '',
        last_working_day: '',
        total_entitlement: ''
      });
    }

    emailjs.send(
        'service_r9dh2rv',         // Replace with actual Service ID
        'template_ijyr8xk', // New template ID you just created
        {
          name: form.name,
          email: form.email,
          department: form.department,
          start_date: form.start_date,
          end_date: form.end_date,
          reason: form.reason
        },
        'tUEnM5jWC3FPhXbtw'          // EmailJS public key
      ).then(
        (result) => {
          toast.success('HR notified successfully:', result.text);
        },
        (error) => {
          toast.error('Error sending HR email:', error.text);
        }
      );


        };

  return (
 <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content grows to fill vertical space */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white rounded-md shadow-md p-6 space-y-6 sm:space-y-8"
        >
        <div>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
              Leave Request Form
          </h3>

         <h3 className="text-2xl bg-blue-100 p-4 rounded-lg shadow-md w-full max-w-md mx-auto text-center sm:text-left">
              <span className="font-bold text-blue-800 block sm:inline">Welcome:</span>
              <span className="font-normal text-gray-600 block sm:inline sm:ml-2">{user.email}</span>
         </h3>




        </div>

        <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded shadow-md">
            <p className="font-medium text-lg">
              Please fill out all required fields. Your request will be sent to HR for review.
            </p>
        </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Name:
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-gray-700 font-medium mb-1">
                Department:
              </label>
              <input
                id="department"
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="office_location" className="block text-gray-700 font-medium mb-1">
                Office Location:
              </label>
              <input
                id="office_location"
                type="text"
                name="office_location"
                value={form.office_location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="date_employed" className="block text-gray-700 font-medium mb-1">
                Date Employed:
              </label>
              <input
                id="date_employed"
                type="date"
                name="date_employed"
                value={form.date_employed}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="employee_id" className="block text-gray-700 font-medium mb-1">
                Employee ID Number:
              </label>
              <input
                id="employee_id"
                type="text"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-gray-700 font-medium mb-1">
                Start Date:
              </label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-gray-700 font-medium mb-1">
                End Date:
              </label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-gray-700 font-medium mb-1">
                Reason:
              </label>
              <select
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a reason</option>
                <option value="Sick">Sick</option>
                <option value="Maternity">Maternity</option>
                <option value="Annual">Annual</option>
                <option value="Exam">Exam</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label htmlFor="resume_date" className="block text-gray-700 font-medium mb-1">
                Date Due to Resume:
              </label>
              <input
                id="resume_date"
                type="date"
                name="resume_date"
                value={form.resume_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="reliever_name" className="block text-gray-700 font-medium mb-1">
                Name of Proposed Reliever:
              </label>
              <input
                id="reliever_name"
                type="text"
                name="reliever_name"
                value={form.reliever_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="last_working_day" className="block text-gray-700 font-medium mb-1">
                Last Working Day:
              </label>
              <input
                id="last_working_day"
                type="date"
                name="last_working_day"
                value={form.last_working_day}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="employee_id" className="block text-gray-700 font-medium mb-1">
                Number Of Days Already Taken:
              </label>
              <input
                id="days_taken"
                type="number"
                name="days_taken"
                value={form.days_taken}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
                <label htmlFor="total_entitlement" className="block text-gray-700 font-medium mb-1">
                  Total Leave Entitlement:
                </label>
                <input
                  id="total_entitlement"
                  type="text"
                  name="total_entitlement"
                  value={form.total_entitlement}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Show calculated leave days and warning if over limit */}
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                          <div>Days Requested: <span className="font-semibold">{leaveDays}</span></div>
                          <div>Days Already Taken: <span className="font-semibold">{form.days_taken || 0}</span></div>
                          <div>Total Entitlement: <span className="font-semibold">{form.total_entitlement || 0}</span></div>
                          <div>Remaining Balance: <span className="font-semibold">
                            {(parseInt(form.total_entitlement) || 0) - (parseInt(form.days_taken) || 0)}
                          </span></div>
                        </div>

                        {isOverLimit && (
                          <div className="text-red-600 text-sm font-medium mt-1">
                            ❌ Requested leave exceeds available balance.
                          </div>
                        )}

            </div>


          </div>

          <button
              type="submit"
              disabled={isOverLimit}
              className={`w-full font-semibold py-3 rounded-md transition-colors ${
                isOverLimit
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Submit Leave Request
          </button>

        </form>
      </main>

      <footer className="bg-white border-t border-gray-300 py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} RFR Professionals Leave Management. All rights reserved.
      </footer>
    </div>

  );
}