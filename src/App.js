import './App.css';
import { supabase } from './supabaseClient';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import LeftSidebar from './components/LeftSidebar';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path='/' element={<LeftSidebar />} />

      </Routes>
    </Router>
  );
}

export default App;
