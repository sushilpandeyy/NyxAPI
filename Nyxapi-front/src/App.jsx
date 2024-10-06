import { useState } from 'react'
import {BrowserRouter as Router,Route , Routes} from 'react-router-dom'
import Navbar from './components/navbar'

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/navbar" element={<Navbar />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
