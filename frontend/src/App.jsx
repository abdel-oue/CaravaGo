import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import VehicleDetails from './pages/VehicleDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route
            path="/profile"
            element={
                <Profile />
            }
          />

          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
