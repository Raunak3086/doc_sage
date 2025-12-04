import { Routes, Route } from 'react-router-dom';
import Interact from './pages/Interact'; // Import the Interact component
import DocumentUpload from './pages/DocumentUpload';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Interact />} /> {/* Default route is now Interact */}
        <Route path="/upload" element={<DocumentUpload />} />
        <Route path="/interact" element={<Interact />} />
      </Routes>
    </>
  );
}

export default App;
