import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, User, Settings } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

export const Header = () => {
  const location = useLocation()
  const { userName } = useUser()

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Poems Read-Aloud</h1>
              <p className="text-sm text-gray-600">Apprendre en s'amusant</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/')}`}
            >
              <BookOpen className="h-4 w-4" />
              Catalogue
            </Link>
            
            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/profile')}`}
            >
              <User className="h-4 w-4" />
              Profil
            </Link>
            
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/admin')}`}
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>

            <div className="ml-4 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {userName}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}