import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formEndpoint = 'https://getform.io/f/bkkndyzb';

    const formBody = new FormData();
    formBody.append('name', formData.name);
    formBody.append('email', formData.email);
    formBody.append('message', formData.message);

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: formBody,
      });

      if (response.ok) {
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      setStatus('ERROR');
    }
  };

  return (
    <div>
      <header>
        <Header />
      </header>

      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
        style={{ backgroundImage: "url('/it.jpg')" }}
      >
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Contact Support</h2>

                <label className="block mb-4">
                Name
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                />
                </label>

                <label className="block mb-4">
                Email
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                />
                </label>

                <label className="block mb-6">
                Message
                <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="mt-1 block w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Write your message here..."
                />
                </label>

                <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
                >
                Send
                </button>

                {status === 'SUCCESS' && (
                <p className="mt-4 text-green-600 text-center">Thanks! Your message has been sent.</p>
                )}
                {status === 'ERROR' && (
                <p className="mt-4 text-red-600 text-center">Oops! Something went wrong.</p>
                )}
            </form>
            </div>

      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default ContactForm;
