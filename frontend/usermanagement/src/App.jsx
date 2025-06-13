import {Route, Router, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Mainpage from './pages/Mainpage';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
          <Routes>

            <Route path="/" element={<Mainpage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" 
            element ={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
            />


          </Routes>
      </div>
    </Router>
  );
}

export default App;