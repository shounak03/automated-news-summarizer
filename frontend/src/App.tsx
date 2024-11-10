
import { Route, Routes } from 'react-router-dom'
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