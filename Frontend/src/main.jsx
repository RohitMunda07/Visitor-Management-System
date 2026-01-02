import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SecurityPage from './pages/SecurityPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './context/store.js'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HodPage from './pages/HodPage.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

const allowedRole = ["admin", "hod"]
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          <Route
            path="/security"
            element={
              <ProtectedRoute allowedRole="security">
                <SecurityPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod"
            element={
              <ProtectedRoute allowedRole="hod">
                <HodPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />


        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

