import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { RequireSurveyAccess } from './components/RequireSurveyAccess'
import { AccediPage } from './pages/AccediPage'
import { AdminPage } from './pages/AdminPage'
import { AnagraficaPage } from './pages/AnagraficaPage'
import { GraziePage } from './pages/GraziePage'
import { Parte1Page } from './pages/Parte1Page'
import { Parte2Page } from './pages/Parte2Page'
import { Parte3Page } from './pages/Parte3Page'
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
          <Route path="/accedi" element={<AccediPage />} />
          <Route path="/qr" element={<QrPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/parte-1"
            element={
              <RequireSurveyAccess>
                <Parte1Page />
              </RequireSurveyAccess>
            }
          />
          <Route
            path="/anagrafica"
            element={
              <RequireSurveyAccess>
                <AnagraficaPage />
              </RequireSurveyAccess>
            }
          />
          <Route
            path="/parte-2"
            element={
              <RequireSurveyAccess>
                <Parte2Page />
              </RequireSurveyAccess>
            }
          />
          <Route
            path="/parte-3"
            element={
              <RequireSurveyAccess>
                <Parte3Page />
              </RequireSurveyAccess>
            }
          />
          <Route path="/grazie" element={<GraziePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  )
}
