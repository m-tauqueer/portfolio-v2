import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TerminalPage } from './pages/TerminalPage'
import { AdminLogin, AdminDashboard } from './pages/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TerminalPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
