import './App.css'
import LandingPage from './components/LandingPage'
import { Route, Routes } from 'react-router-dom'
import SummaryPage from './components/SummaryPage'
import Summary from './components/Summary'
import Header from './components/header'
import Footer from './components/Footer'
import NewsDisplay from './components/NewsPage'

function App() {


  return (
    <>
    <Header/>  
    <Routes>
      <Route path="/" element={<NewsDisplay/>} />
      <Route path="/:title" element={<Summary/>} />
    </Routes>
    <Footer/>
    </>

  )
}

export default App