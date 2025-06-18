import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 text-sm mt-12 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {/* Logo and help center */}
        <div>
          <img src="rfr.png" alt="rfr" className="w-28 mx-auto sm:mx-0 mb-4 sm:mb-0" />
          <ul className="space-y-2 text-center sm:text-left">
            <li>
              <a href="#" className="hover:underline">
                Visit Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Contact info columns */}
        <div className="sm:col-span-2 md:col-span-4 flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex-1">
              <h4 className="text-lg font-semibold mb-3 text-center sm:text-left">
                RFR Professionals International Group Limited
              </h4>
              <ul className="space-y-2 text-center sm:text-left">
                <li>71-75, Shelton Street, Covent Garden.</li>
                <li>London WC2H 9JQ United Kingdom</li>
                <li>+44 207 754 5911</li>
                <li>info.uk@rfrprofessionals.com</li>
                <li>info.group@rfrprofessionals.com</li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-300 px-6 py-6 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto text-xs text-gray-600">
        <p className="text-center sm:text-left w-full sm:w-auto mb-2 sm:mb-0">
          © 2025 RFR Professionals Leave Management. All rights reserved.
        </p>
        <div className="flex justify-center sm:justify-start space-x-4 w-full sm:w-auto">
          <a href="#" className="hover:underline">
            English
          </a>
          <a href="#" className="hover:underline">
            San Francisco Bay Area
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
