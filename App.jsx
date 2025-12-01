import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Recommendations from './pages/Recommendations'
import Feedback from './pages/Feedback'
import StudyAnalytics from './pages/StudyAnalytics'
import LearningResources from './pages/LearningResources'
import StudyGroups from './pages/StudyGroups'
import WelcomeMessage from './components/WelcomeMessage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { user, showWelcome, setShowWelcome } = useAuth()

  return (
    <>
      {showWelcome && user && (
        <WelcomeMessage 
          name={user.firstName} 
          onClose={() => setShowWelcome(false)} 
        />
      )}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile/:id" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/recommendations" 
          element={
            <PrivateRoute>
              <Recommendations />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/feedback" 
          element={
            <PrivateRoute>
              <Feedback />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <StudyAnalytics />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/resources" 
          element={
            <PrivateRoute>
              <LearningResources />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/groups" 
          element={
            <PrivateRoute>
              <StudyGroups />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

