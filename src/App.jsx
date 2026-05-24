import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to admin login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
