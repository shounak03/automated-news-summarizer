import './App.css'
import LandingPage from './components/LandingPage'
import { Route, Routes } from 'react-router-dom'
import SummaryPage from './components/SummaryPage'
import Summary from './components/Summary'

function App() {


  return (  
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/:title" element={<Summary/>} />
    </Routes>

  )
}

export default App