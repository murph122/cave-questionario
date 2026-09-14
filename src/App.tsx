import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { AnagraficaPage } from './pages/AnagraficaPage'
import { GraziePage } from './pages/GraziePage'
import { Parte1Page } from './pages/Parte1Page'
import { Parte2Page } from './pages/Parte2Page'
import { Parte3Page } from './pages/Parte3Page'
import { PrenotaPage } from './pages/PrenotaPage'
import { WelcomePage } from './pages/WelcomePage'

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/prenota" element={<PrenotaPage />} />
          <Route path="/anagrafica" element={<AnagraficaPage />} />
          <Route path="/parte-1" element={<Parte1Page />} />
          <Route path="/parte-2" element={<Parte2Page />} />
          <Route path="/parte-3" element={<Parte3Page />} />
          <Route path="/grazie" element={<GraziePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  )
}
