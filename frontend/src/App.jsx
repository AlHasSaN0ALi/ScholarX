import { useState } from 'react'
import Contact from './pages/Contact/Contact'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Contact></Contact>

    </>
  )
}

export default App
