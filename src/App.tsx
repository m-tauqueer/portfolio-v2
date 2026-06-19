import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ViewModeProvider } from './context/ViewModeContext'
import { PortfolioPage } from './pages/PortfolioPage'
import { AdminLogin, AdminDashboard } from './pages/AdminPage'

export default function App() {
  return (
    <ViewModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ViewModeProvider>
  )
}
