import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Courses from './pages/Courses/Courses'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Contact from './pages/Contact/Contact'
import CoursePage from './pages/CourseInfo/CourseInfo'
import ForgetPassword from './pages/forget-password/forget'
import ResetPassword from './pages/reset-password/reset'
import NotFound from './pages/NotFound/NotFound'
import NavBar from './components/NavBar/NavBar'
import Footer from './components/Footer/Footer'
import Services from './pages/Services/Services'
import 'sweetalert2/dist/sweetalert2.min.css';
import './styles/sweetalert.css';
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResults from './pages/Search/SearchResults'
import GoogleCallback from './pages/GoogleCallback/GoogleCallback'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'

// Layout component to ensure navbar consistency
const Layout = ({ children, path }) => {
  return (
    <>
      <NavBar activePage={path} />
      {children}
      <Footer />
    </>
  )
}

// Wrapper component to access location in Layout
const LayoutWithPath = ({ children }) => {
  const location = useLocation();
  return <Layout path={location.pathname} children={children} />;
}

function App() {
  return (
    <>
    <Router>
      <div className=''>
        <Routes>
          <Route path="/" element={<LayoutWithPath><Home /></LayoutWithPath>} />
          <Route path="/about" element={<LayoutWithPath><About /></LayoutWithPath>} />
          <Route path="/services" element={<LayoutWithPath><Services /></LayoutWithPath>} />
          <Route path="/courses" element={<LayoutWithPath><Courses /></LayoutWithPath>} />
          <Route path="/login" element={<LayoutWithPath><Login /></LayoutWithPath>} />
          <Route path="/signup" element={<LayoutWithPath><Signup /></LayoutWithPath>} />
          <Route path="/CoursePage/:courseId" element={<LayoutWithPath><CoursePage /></LayoutWithPath>} />
          <Route path="/Contact" element={<LayoutWithPath><Contact /></LayoutWithPath>} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/search-results" element={<LayoutWithPath><SearchResults /></LayoutWithPath>} />
          <Route path="/auth/google" element={<LayoutWithPath><GoogleCallback /></LayoutWithPath>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* Catch all route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
