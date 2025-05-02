import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Services from './pages/Services/Services'
import Courses from './pages/Courses/Courses'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Contact from './pages/Contact/Contact'
import CoursePage from './pages/CourseInfo/CourseInfo'
import ForgetPassword from './pages/forget-password/forget'
import 'sweetalert2/dist/sweetalert2.min.css';
import './styles/sweetalert.css';
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResults from './pages/Search/SearchResults'
import GoogleCallback from './pages/GoogleCallback/GoogleCallback'

function App() {
  return (
    <>
    <Router>
      <div className=''>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/CoursePage/:courseId" element={<CoursePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/auth/google" element={<GoogleCallback />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
