import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from './lib/i18n'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import DiagnosisPage from './pages/DiagnosisPage'
import ResearchPage from './pages/ResearchPage'
import ProtocolsPage from './pages/ProtocolsPage'
import PatientsPage from './pages/PatientsPage'
import ProfilePage from './pages/ProfilePage'
import AnalyticsPage from './pages/AnalyticsPage'

import './App.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
                <Header />
                
                {isLoading && <LoadingSpinner />}
                
                <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/diagnosis" element={<DiagnosisPage />} />
                    <Route path="/research" element={<ResearchPage />} />
                    <Route path="/protocols" element={<ProtocolsPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                  </Routes>
                </main>
                
                <Footer />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default App

