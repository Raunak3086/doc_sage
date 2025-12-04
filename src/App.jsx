import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DocumentUpload from './pages/DocumentUpload';
import Interact from './pages/Interact'; // Import the new Interact component
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<DocumentUpload />} />
        <Route path="/interact" element={<Interact />} /> {/* Add the new route */}
      </Routes>
    </>
  );
}

export default App;
