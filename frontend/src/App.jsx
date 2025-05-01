import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Services from './pages/Services/Services'
import Courses from './pages/Courses/Courses'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import CourseInfo from './pages/CourseInfo/CourseInfo'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/CourseInfo" element={<CourseInfo/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
