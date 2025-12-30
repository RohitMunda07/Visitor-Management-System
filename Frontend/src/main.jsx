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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path='/security' element={<SecurityPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
