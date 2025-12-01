import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionStartTime, setSessionStartTime] = useState(null)

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('EduConnect_user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      // Initialize session tracking if user is logged in
      if (parsedUser) {
        initializeSessionTracking(parsedUser)
      }
    }
    setLoading(false)
  }, [])

  // Track active time and update stats periodically
  useEffect(() => {
    if (!user || !sessionStartTime) return

    // Update stats every 5 minutes of active time
    const interval = setInterval(() => {
      recordStudyTime(user)
    }, 5 * 60 * 1000) // 5 minutes

    // Also update on component unmount or user change
    return () => {
      if (sessionStartTime) {
        recordStudyTime(user)
      }
      clearInterval(interval)
    }
  }, [user, sessionStartTime])

  const initializeSessionTracking = (userData) => {
    const now = new Date()
    // Check if we need to reset weekly hours
    let updatedUser = resetWeeklyHoursIfNewWeek(userData)
    if (updatedUser !== userData) {
      updateUserInStorage(updatedUser)
      userData = updatedUser
    }
    
    const lastLogin = userData.lastLoginTime ? new Date(userData.lastLoginTime) : null
    
    // If last login was today, continue tracking
    // Otherwise, start a new session
    if (!lastLogin || !isSameDay(now, lastLogin)) {
      setSessionStartTime(now)
      // Record a new session
      recordNewSession(userData)
    } else {
      // Continue from last session
      setSessionStartTime(new Date(userData.lastLoginTime))
    }
  }

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  const getDayOfWeek = (date) => {
    // Returns 0-6 (Sunday-Saturday), but we want Monday=0, Sunday=6
    const day = date.getDay()
    return day === 0 ? 6 : day - 1
  }

  const getWeekStart = (date) => {
    // Get Monday of the current week
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
  }

  const isSameWeek = (date1, date2) => {
    const week1 = getWeekStart(date1)
    const week2 = getWeekStart(date2)
    return week1.getTime() === week2.getTime()
  }

  const resetWeeklyHoursIfNewWeek = (userData) => {
    const now = new Date()
    const lastWeekReset = userData.lastWeekReset ? new Date(userData.lastWeekReset) : null
    
    if (!lastWeekReset || !isSameWeek(now, lastWeekReset)) {
      // New week - reset weekly hours
      return {
        ...userData,
        lastWeekReset: now.toISOString(),
        studyStats: {
          ...userData.studyStats,
          weeklyHours: [0, 0, 0, 0, 0, 0, 0]
        }
      }
    }
    return userData
  }

  const recordNewSession = (userData) => {
    const updatedUser = {
      ...userData,
      lastLoginTime: new Date().toISOString(),
      studyStats: {
        ...userData.studyStats,
        sessionsCompleted: (userData.studyStats?.sessionsCompleted || 0) + 1
      }
    }
    updateUserInStorage(updatedUser)
    setUser(updatedUser)
  }

  const recordStudyTime = (userData) => {
    if (!sessionStartTime) return

    const now = new Date()
    const sessionDuration = (now - sessionStartTime) / (1000 * 60 * 60) // Convert to hours
    const hoursToAdd = Math.min(sessionDuration, 0.5) // Cap at 0.5 hours per update (5 min = 0.083 hours, but we'll add 0.5 for active session)

    const currentStats = userData.studyStats || {
      totalHours: 0,
      weeklyHours: [0, 0, 0, 0, 0, 0, 0],
      sessionsCompleted: 0,
      studyProgress: 0
    }

    // Get current day of week (0 = Monday, 6 = Sunday)
    const dayOfWeek = getDayOfWeek(now)
    
    // Update weekly hours for current day
    const updatedWeeklyHours = [...currentStats.weeklyHours]
    updatedWeeklyHours[dayOfWeek] = (updatedWeeklyHours[dayOfWeek] || 0) + hoursToAdd

    // Calculate total hours
    const totalHours = currentStats.totalHours + hoursToAdd

    // Calculate study progress (based on weekly goal of 20 hours)
    const weeklyGoal = 20
    const weeklyTotal = updatedWeeklyHours.reduce((a, b) => a + b, 0)
    const studyProgress = Math.min(Math.round((weeklyTotal / weeklyGoal) * 100), 100)

    const updatedStats = {
      totalHours: parseFloat(totalHours.toFixed(2)),
      weeklyHours: updatedWeeklyHours.map(h => parseFloat(h.toFixed(2))),
      sessionsCompleted: currentStats.sessionsCompleted || 0,
      studyProgress: studyProgress
    }

    const updatedUser = {
      ...userData,
      lastLoginTime: now.toISOString(),
      studyStats: updatedStats
    }

    updateUserInStorage(updatedUser)
    setUser(updatedUser)
    setSessionStartTime(now) // Reset session start time
  }

  const updateUserInStorage = (updatedUser) => {
    localStorage.setItem('EduConnect_user', JSON.stringify(updatedUser))
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('EduConnect_users') || '[]')
    const userIndex = users.findIndex(u => u.id === updatedUser.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem('EduConnect_users', JSON.stringify(users))
    }
  }

  const signup = (userData) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('EduConnect_users') || '[]')
    const emailExists = existingUsers.some(u => 
      u.email && userData.email && 
      u.email.toLowerCase().trim() === userData.email.toLowerCase().trim()
    )
    
    if (emailExists) {
      throw new Error('An account with this email already exists. Please sign in instead.')
    }
    
    // Generate a unique ID for the user
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      studyStats: {
        totalHours: 0,
        weeklyHours: [0, 0, 0, 0, 0, 0, 0], // 7 days
        sessionsCompleted: 0,
        studyProgress: 0
      }
    }
    
    // Add new user to existing users
    existingUsers.push(newUser)
    localStorage.setItem('EduConnect_users', JSON.stringify(existingUsers))
    
    // Set current user
    localStorage.setItem('EduConnect_user', JSON.stringify(newUser))
    setUser(newUser)
    setShowWelcome(true)
    return newUser
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('EduConnect_users') || '[]')
    // Case-insensitive email matching
    const foundUser = users.find(u => 
      u.email && email && 
      u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
      u.password === password
    )
    
    if (foundUser) {
      // Initialize study session tracking
      const now = new Date()
      const lastLogin = foundUser.lastLoginTime ? new Date(foundUser.lastLoginTime) : null
      
      let userToSet = foundUser
      
      // Check if we need to reset weekly hours
      let userToCheck = resetWeeklyHoursIfNewWeek(foundUser)
      if (userToCheck !== foundUser) {
        updateUserInStorage(userToCheck)
        foundUser = userToCheck
      }
      
      // Record new session if it's a new day or first login
      if (!lastLogin || !isSameDay(now, lastLogin)) {
        userToSet = {
          ...foundUser,
          lastLoginTime: now.toISOString(),
          studyStats: {
            ...foundUser.studyStats,
            sessionsCompleted: (foundUser.studyStats?.sessionsCompleted || 0) + 1
          }
        }
        updateUserInStorage(userToSet)
        setSessionStartTime(now)
      } else {
        setSessionStartTime(new Date(foundUser.lastLoginTime))
        userToSet = foundUser
      }
      
      setUser(userToSet)
      localStorage.setItem('EduConnect_user', JSON.stringify(userToSet))
      setShowWelcome(true)
      return userToSet
    }
    return null
  }

  const logout = () => {
    localStorage.removeItem('EduConnect_user')
    setUser(null)
    setShowWelcome(false)
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    updateUserInStorage(updatedUser)
    setUser(updatedUser)
  }

  const updateStudyStats = (stats) => {
    updateUser({
      studyStats: {
        ...user.studyStats,
        ...stats
      }
    })
  }

  const recordManualStudySession = (hours) => {
    if (!user) return

    const currentStats = user.studyStats || {
      totalHours: 0,
      weeklyHours: [0, 0, 0, 0, 0, 0, 0],
      sessionsCompleted: 0,
      studyProgress: 0
    }

    const now = new Date()
    const dayOfWeek = getDayOfWeek(now)
    
    const updatedWeeklyHours = [...currentStats.weeklyHours]
    updatedWeeklyHours[dayOfWeek] = (updatedWeeklyHours[dayOfWeek] || 0) + hours

    const totalHours = currentStats.totalHours + hours
    const weeklyTotal = updatedWeeklyHours.reduce((a, b) => a + b, 0)
    const weeklyGoal = 20
    const studyProgress = Math.min(Math.round((weeklyTotal / weeklyGoal) * 100), 100)

    updateUser({
      studyStats: {
        totalHours: parseFloat(totalHours.toFixed(2)),
        weeklyHours: updatedWeeklyHours.map(h => parseFloat(h.toFixed(2))),
        sessionsCompleted: (currentStats.sessionsCompleted || 0) + 1,
        studyProgress: studyProgress
      }
    })
  }

  const value = {
    user,
    signup,
    login,
    logout,
    updateUser,
    updateStudyStats,
    recordManualStudySession,
    showWelcome,
    setShowWelcome,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

