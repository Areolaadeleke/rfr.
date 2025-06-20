import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import StaffList from './StaffList'
import HrDashboard from './HrDashboard'
import LeaveForm from './LeaveForm'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import StaffPortal from './StaffPortal'
import ContactForm from './ContactForm'
import EmployeeHandbook from './EmpolyeeHandbook'
import AdminDashboard from './AdminDashboard'
import Loader from './Loader'
import { ToastContainer } from 'react-toastify'
import CompanyCalendar from './CompanyCalendar'



function App() {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);

    

  useEffect(() => {
    // Get logged-in user on mount
    const user = supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user)  // this sets the user object
      setLoading(false); 
    })

    // Optionally listen to auth changes (sign in/out)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

    if (loading) {
    return <div><Loader /></div>;
  }



  return (
    <>

    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
     />

    <Router>
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path='/stafflist' element={<StaffPortal />} />
        <Route path='/admin' element={<AdminDashboard users={currentUser} />} />
        <Route path='/linemanager' element={<HrDashboard />} />
        {/* <Route path='/staff'  element={ currentUser ? <LeaveForm user={currentUser} /> : <Navigate to="/login" setCurrentUser={setCurrentUser} /> */}
        <Route path='/staff' element={<StaffPortal user={currentUser}/>} />
        <Route path='/contact' element={<ContactForm />} />
        {/* <Route path='/ply' element={<EmployeeHandbook />} /> */}
        <Route path='/good' element={<EmployeeHandbook />} />
        <Route path='/cal' element={<CompanyCalendar />} />
      </Routes>
    </Router>

    </>
  )
}

export default App
