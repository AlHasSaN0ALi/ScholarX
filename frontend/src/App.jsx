import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Services from './pages/Services/Services'
import Courses from './pages/Courses/Courses'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import './App.css'
import SearchResults from './pages/Search/SearchResults'

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
          <Route path="/signup" element={<Signup />} />
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
          </div>
    </Router>
    </>
  )
}

export default App
