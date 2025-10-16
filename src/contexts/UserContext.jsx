import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || 'demo-user-123'
  })

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || 'Élève Démo'
  })

  useEffect(() => {
    localStorage.setItem('userId', userId)
    localStorage.setItem('userName', userName)
  }, [userId, userName])

  const value = {
    userId,
    userName,
    setUserId,
    setUserName
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}