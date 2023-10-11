import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import MapPage from './pages/map-page/MapPage';
import Navbar from './components/Navbar';
const App=()=>{
  return(
    <>
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="map-page" element={<MapPage />} />

      </Routes>
    </Router>
    </>
  )
}
export default App;