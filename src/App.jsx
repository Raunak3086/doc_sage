import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Import Home
import Interact from './pages/Interact';
import DocumentUpload from './pages/DocumentUpload';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default route is now Home */}
        <Route path="/upload" element={<DocumentUpload />} />
        <Route path="/interact" element={<Interact />} />
      </Routes>
    </>
  );
}

export default App;
