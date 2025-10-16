import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { PoemPage } from './pages/PoemPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'
import ConnectionTest from './pages/ConnectionTest'
import TestProxy from './components/TestProxy'
import { ApiProvider } from './contexts/ApiContext'
import { UserProvider } from './contexts/UserContext'

// Test connection
import './test-connection.js'

function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/poem/:id" element={<PoemPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/connection-test" element={<ConnectionTest />} />
                <Route path="/proxy-test" element={<TestProxy />} />
              </Routes>
            </main>
          </div>
        </Router>
      </UserProvider>
    </ApiProvider>
  )
}

export default App