import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { AdminPage } from './pages/AdminPage'
import { GraziePage } from './pages/GraziePage'
import { PrenotaPage } from './pages/PrenotaPage'
import { QrPage } from './pages/QrPage'
import { WelcomePage } from './pages/WelcomePage'

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/prenota" element={<PrenotaPage />} />
          <Route path="/qr" element={<QrPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/grazie" element={<GraziePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  )
}
