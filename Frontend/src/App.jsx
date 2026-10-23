import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Auth/pages/Login'; // Path apne folder hisaab se adjust kar lena
import Register from '../Auth/pages/Register'; // Path adjust kar lena
import ProtectedRoute from '../Auth/ProtectedRoute'; // Path adjust kar lena
import Dashboard from '../Auth/pages/Dashboard';
import ResumeDetail from '../Auth/pages/ResumeDetail';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Koi bhi access kar sakta hai */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Sirf login user dekh payega */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-view"
          element={
            <ProtectedRoute>
              <ResumeDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Agar koi galat URL daale toh wapas Login par bhej do */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
