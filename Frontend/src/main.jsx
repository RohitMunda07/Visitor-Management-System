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
              <ProtectedRoute allowedRole={allowedRole}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hod"
            element={
              <ProtectedRoute allowedRole={allowedRole}>
                <HodPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

