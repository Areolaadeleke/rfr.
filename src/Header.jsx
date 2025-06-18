// import { Link, useNavigate } from "react-router-dom";
// import { supabase } from './supabaseClient';

// function Header({ setCurrentUser }) {
//   const navigate = useNavigate();

//   const logout = async () => {
//     await supabase.auth.signOut();
//     setCurrentUser(null);
//     navigate('/');
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-6 bg-white shadow-md h-20">
//       <div className="w-40">
//         <img src="rfr.png" alt="rfr" className="w-40" />
//       </div>

//       <ul className="hidden md:flex space-x-6 text-sm sm:text-base font-medium text-gray-700">
//         <li className="group relative cursor-pointer">
//           <Link
//             to="/login"
//             className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300 
//             before:content-[''] before:absolute before:left-0 before:-bottom-1 
//             before:h-0.5 before:w-0 before:bg-blue-600 before:transition-all 
//             before:duration-300 group-hover:before:w-full"
//           >
//             HR Portal
//           </Link>
//         </li>
//         <li className="group relative cursor-pointer">
//           <Link
//             to="/login"
//             className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300 
//             before:content-[''] before:absolute before:left-0 before:-bottom-1 
//             before:h-0.5 before:w-0 before:bg-blue-600 before:transition-all 
//             before:duration-300 group-hover:before:w-full"
//           >
//             Staff Portal
//           </Link>
//         </li>
//         <li className="group relative cursor-pointer">
//           <Link
//             to="/login"
//             className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300 
//             before:content-[''] before:absolute before:left-0 before:-bottom-1 
//             before:h-0.5 before:w-0 before:bg-blue-600 before:transition-all 
//             before:duration-300 group-hover:before:w-full"
//           >
//             Leave Portal
//           </Link>
//         </li>
//         <li className="group relative cursor-pointer">
//           <Link
//             to="/login"
//             className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300 
//             before:content-[''] before:absolute before:left-0 before:-bottom-1 
//             before:h-0.5 before:w-0 before:bg-blue-600 before:transition-all 
//             before:duration-300 group-hover:before:w-full"
//           >
//             Line Manager Portal
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Header;


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from './supabaseClient';
import { HiMenu, HiX } from "react-icons/hi";

function Header({ setCurrentUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 h-20">
        <div className="w-36">
          <img src="rfr.png" alt="rfr" className="w-36" />
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex space-x-6 text-sm sm:text-base font-medium text-gray-700">
          {[
            { to: '/login', label: 'HR Portal' },
            { to: '/login', label: 'Staff Portal' },
            { to: '/login', label: 'Leave Portal' },
            { to: '/login', label: 'Line Manager Portal' },
          ].map(({ to, label }) => (
            <li key={label} className="group relative cursor-pointer">
              <Link
                to={to}
                className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300
                before:content-[''] before:absolute before:left-0 before:-bottom-1 
                before:h-0.5 before:w-0 before:bg-blue-600 before:transition-all 
                before:duration-300 group-hover:before:w-full"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-2 bg-white text-sm font-medium text-gray-700 border-t">
          {[
            { to: '/login', label: 'HR Portal' },
            { to: '/login', label: 'Staff Portal' },
            { to: '/login', label: 'Leave Portal' },
            { to: '/login', label: 'Line Manager Portal' },
          ].map(({ to, label }) => (
            <li key={label}>
              <Link
                to={to}
                className="block py-2 border-b border-gray-100 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Header;

