// import { useEffect, useState } from 'react';
// import { supabase } from './supabaseClient';
// import { getUserRole } from './getUserRole';
// import Login from './Login';
// import LeaveForm from './LeaveForm';
// import HrDashboard from './HrDashboard';
// import Loader from './Loader';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Header from './Header';

// function Landing() {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState('');
//   const [loading, setLoading] = useState(true);

//   // On initial load, check if a user session exists
//   useEffect(() => {
//     const getSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       const currentUser = session?.user;
//       if (currentUser) {
//         setUser(currentUser);
//       }
//       setLoading(false);
//     };
//     getSession();
//   }, []);

//   // Fetch user role whenever `user` changes (including after login)
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       if (user) {
//         setLoading(true);
//         const role = await getUserRole(user.id);
//         setRole(role);
//         setLoading(false);
//       } else {
//         setRole('');
//       }
//     };
//     fetchUserRole();
//   }, [user]);

//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setRole('');
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader />
//       </div>
//     );
//   }

//   if (!user) return <Login onLogin={setUser} />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-2 font-serif">
//       <div className="w-full mx-auto bg-white shadow-md rounded-md p-5">
//         <div className="bg-white rounded-lg shadow-sm mb-5">
          
//         <header>
//               {/* <img src='rfr.png' alt='rfr' className='w-[130px]'/>

//               <h1 className="bg-white text-xl font-semibold text-gray-800 px-2 py-1 rounded border border-gray-200 shadow-sm">
//                 🗂️ Leave Management System
//               </h1>

//               <button
//                 onClick={logout}
//                 className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm text-sm"
//               >
//                 Logout
//               </button> */}
//               <Header />
//         </header>


//         </div>


//         <div className="mb-6 mx-auto max-w-xs px-4 py-3 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2 text-blue-800 shadow-sm">
//           <svg
//             className="w-5 h-5 text-blue-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5.121 17.804A13.937 13.937 0 0112 15c2.192 0 4.243.526 6.121 1.453M15 10a3 3 0 11-6 0 3 3 0 016 0z"
//             />
//           </svg>
//           <p className="text-sm">
//             Logged in as: <span className="font-semibold">{role}</span>
//           </p>
//         </div>

//         {role === 'staff' && (
//           <section>
//            <h2 className="bg-indigo-50 text-2xl font-semibold text-indigo-700 px-4 py-3 rounded-md border border-indigo-200 shadow-sm mb-4">
//               📝 Staff Leave Request Form
//            </h2>

//             <LeaveForm user={user} />
//           </section>
//         )}

//         {role === 'hr' && (
//           <section>
//             <HrDashboard />
//           </section>
//         )}
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// }

// export default Landing;


import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { getUserRole } from './getUserRole';
import Login from './Login';
import HrDashboard from './HrDashboard';
import Loader from './Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

function Landing() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    getSession();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        setLoading(true);
        const role = await getUserRole(user.id);
        setRole(role);
        setLoading(false);
      } else {
        setRole('');
      }
    };
    fetchUserRole();
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4 sm:p-6">
    <Header onLogout={logout} />

    {/* === Public Welcome Section === */}
    <div className="w-full max-w-full mx-auto mt-20 sm:mt-20 bg-white rounded-lg shadow-lg p-5 sm:p-10 ">
      {/* Title & Intro */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4">
          Welcome to RFR Professionals Portal Hub
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          Your central gateway to staff services, HR tools, and management systems — all in one place.
        </p>
      </div>

      {/* Portal Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-blue-700">👩‍💼 Staff Portal</h2>
          <p className="text-sm text-gray-600 mt-2">
            Submit requests, view documents, and stay up to date with internal policies.
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-green-700">📊 HR Dashboard</h2>
          <p className="text-sm text-gray-600 mt-2">
            Manage employee data, review submissions, and access reporting tools.
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-yellow-700">🧑‍💼 Management Access</h2>
          <p className="text-sm text-gray-600 mt-2">
            Monitor department activity, KPIs, and team leave balances at a glance.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">⚡ Quick Links</h3>
        <div className="flex flex-wrap justify-center gap-4">
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 p-4">
          <li>
            <Link
              to="/good"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Employee Handbook
            </Link>
          </li>
          <li>
            <Link
              to="/expense-claims"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Expense Claims
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Leave Request
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              IT Helpdesk
            </Link>
          </li>
          <li>
            <Link
              to="/hr-policies"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              HR Policies
            </Link>
          </li>
        </ul>

        </div>
      </div>

      {/* Announcements */}
      <div className="text-left max-w-4xl mx-auto mb-12">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">📢 Latest Announcements</h3>
        <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
          <li className="border-l-4 border-blue-400 pl-3">📅 Quarterly Town Hall – June 27 @ 10:00 AM</li>
          <li className="border-l-4 border-green-400 pl-3">✅ New remote work policy goes live next week</li>
          <li className="border-l-4 border-yellow-400 pl-3">🛠 Maintenance scheduled: Friday 12AM–2AM</li>
        </ul>
      </div>

      {/* Tools */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">🔗 Explore Our Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <a href="#" className="block p-5 bg-white rounded-lg border shadow hover:shadow-md transition">
            <h4 className="text-blue-700 font-semibold">📁 Document Center</h4>
            <p className="text-sm text-gray-600 mt-2">Access HR policies, handbooks, and templates.</p>
          </a>
          <a href="#" className="block p-5 bg-white rounded-lg border shadow hover:shadow-md transition">
            <h4 className="text-green-700 font-semibold">💬 Internal Support</h4>
            <p className="text-sm text-gray-600 mt-2">Get help with tools, HR, or account issues.</p>
          </a>
          {/* <a href="#" className="block p-5 bg-white rounded-lg border shadow hover:shadow-md transition">
            <h4 className="text-yellow-700 font-semibold">🗓️ Company Calendar</h4>
            <p className="text-sm text-gray-600 mt-2">Stay updated on key dates and holidays.</p>
          </a> */}

           <Link
                    to="/cal"
                   className="block p-5 bg-white rounded-lg border shadow hover:shadow-md transition"
                  >
                   <h4 className="text-yellow-700 font-semibold">🗓️ Company Calendar</h4>
                   <p className="text-sm text-gray-600 mt-2">Stay updated on key dates and holidays.</p>
            </Link>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="mb-12 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">📚 Featured Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <h4 className="font-semibold text-indigo-700">Onboarding Guide</h4>
            <p className="text-sm text-gray-600 mt-2">A step-by-step handbook for new team members.</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <h4 className="font-semibold text-indigo-700">Performance Toolkit</h4>
            <p className="text-sm text-gray-600 mt-2">Templates, reviews, and goal tracking documents.</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <h4 className="font-semibold text-indigo-700">Compliance Training</h4>
            <p className="text-sm text-gray-600 mt-2">Required courses and certifications overview.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-12 max-w-5xl mx-auto text-center">
        <h3 className="text-xl font-semibold text-blue-800 mb-6">💬 What Our Team Says</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white p-5 border rounded-lg shadow">
            <p className="italic text-gray-700">“The onboarding experience at RFR Professionals was incredibly smooth. I felt supported from day one!”</p>
            <p className="text-sm text-gray-500 mt-2 text-right">– Adesola Oladejo., HR</p>
          </div>
          <div className="bg-white p-5 border rounded-lg shadow">
            <p className="italic text-gray-700">"Having a central portal for all my HR needs has saved me so much time—everything I need is just a click away!”</p>
            <p className="text-sm text-gray-500 mt-2 text-right">– Adeleke A., IT Support</p>
          </div>
        </div>
      </div>

      {/* Upcoming Training & Events */}
      <div className="mb-12 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">🎓 Upcoming Training & Events</h3>
        <ul className="space-y-4 text-gray-700 max-w-4xl mx-auto">
          <li className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-blue-700">Effective Communication Workshop</h4>
              <p className="text-sm">June 20, 2025 — 2:00 PM to 4:00 PM</p>
            </div>
            <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">Register</a>
          </li>
          <li className="bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-green-700">Diversity & Inclusion Seminar</h4>
              <p className="text-sm">July 5, 2025 — 10:00 AM to 12:00 PM</p>
            </div>
            <a href="#" className="text-green-600 underline hover:text-green-800 text-sm">Register</a>
          </li>
          <li className="bg-yellow-50 p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-yellow-700">Leadership Skills Training</h4>
              <p className="text-sm">July 15, 2025 — 1:00 PM to 5:00 PM</p>
            </div>
            <a href="#" className="text-yellow-600 underline hover:text-yellow-800 text-sm">Register</a>
          </li>
        </ul>
      </div>

      {/* FAQs */}
      <div className="mb-12 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">❓ Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-blue-700">How do I reset my password?</h4>
            <p className="text-gray-700 text-sm mt-1"> contact IT support at <Link to="/contact" className="text-blue-600 underline">IT Support</Link></p>
          </div>
          <div>
            <h4 className="font-semibold text-green-700">Where can I find the company holiday schedule?</h4>
            <p className="text-gray-700 text-sm mt-1">The calendar tool in the portal lists all official holidays and important dates.</p>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-700">Who do I contact for HR-related queries?</h4>
            <p className="text-gray-700 text-sm mt-1">Reach out to our HR team via the Internal Support tool or email hr@acmecorp.com.</p>
          </div>
        </div>
      </div>

      {/* Employee Spotlight */}
      <div className="mb-12 max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-6 text-center">👤 Managing Director’s Note</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src="/E.R.png"
            alt="Employee"
            className="w-32 h-32 rounded-full object-cover shadow"
          />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Emmanuel Rominiyi</h4>
            <p className="text-gray-700 italic">"At RFR Professionals, our strength lies in our people. We are committed to creating a workplace that fosters collaboration, innovation, and respect. Let’s continue to support one another and strive for excellence together."</p>
          </div>
        </div>
      </div>

      {/* Quick Tips & Best Practices */}
      <div className="mb-12 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">💡 Quick Tips & Best Practices</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
          <li>Keep your profile updated with the latest contact details.</li>
          <li>Regularly check announcements to stay informed about company news.</li>
          <li>Use the Document Center to download necessary forms and policies.</li>
          <li>Leverage the calendar to plan leaves and avoid scheduling conflicts.</li>
        </ul>
      </div>

  

      {/* Quote */}
      <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-lg shadow max-w-4xl mx-auto mb-12">
        <blockquote className="italic text-indigo-700 text-lg text-center italic">
          “........Consistently adding value”
        </blockquote>
        <p className="text-right text-sm text-gray-500 mt-2">— MD, Emmanuel Rominiyi</p>
      </div>

      {/* How It Works */}
      <div className="text-left max-w-2xl mx-auto mb-12">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">🔐 How It Works</h3>
        <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-1">
          <li>Browse the portal and learn about its features</li>
          <li>Log in with your company email when you're ready</li>
          <li>Access a custom dashboard based on your role</li>
        </ul>
      </div>

      {/* Support Section */}
      <div className="text-left max-w-2xl mx-auto mb-24">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">🆘 Need Help?</h3>
        <p className="text-sm sm:text-base text-gray-700">
          Contact our support team via 

          <Link to='/contact' className="text-blue-600 underline">
             IT Support
          </Link>
          . We're here to assist you!
        </p>
      </div>
    </div>

    <footer>
       <Footer />
    </footer>
  </div>
);




}

export default Landing;
