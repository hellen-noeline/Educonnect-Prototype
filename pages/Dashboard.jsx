import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navigation from '../components/Navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import '../styles/Dashboard.css'

function Dashboard() {
  const { user, logout, recordManualStudySession } = useAuth()
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState([])
  const [sessionTimer, setSessionTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerStartTime, setTimerStartTime] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Auto-start timer when user is on dashboard
  useEffect(() => {
    if (user && !isTimerRunning && !timerStartTime) {
      setIsTimerRunning(true)
      setTimerStartTime(Date.now())
    }
  }, [user, isTimerRunning, timerStartTime])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isTimerRunning && timerStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000)
        setSessionTimer(elapsed)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timerStartTime])

  // Save session on unmount
  useEffect(() => {
    return () => {
      if (isTimerRunning && timerStartTime) {
        const hours = (Date.now() - timerStartTime) / (1000 * 60 * 60)
        if (hours > 0.01) { // Only record if more than 1 minute
          recordManualStudySession(hours)
        }
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Load recommendations
    const loadRecommendations = async () => {
      try {
        const { loadDataset, getDatasetUsers } = await import('../utils/datasetLoader')
        const { getRecommendations } = await import('../utils/recommendationEngine')
        
        await loadDataset()
        const allUsers = [
          ...getDatasetUsers(),
          ...JSON.parse(localStorage.getItem('EduConnect_users') || '[]')
        ]
        
        const recs = getRecommendations(user, allUsers, 3)
        setRecommendations(recs)
      } catch (error) {
        console.error('Error loading recommendations:', error)
      }
    }
    
    if (user) {
      loadRecommendations()
    }
  }, [user])

  if (!user) return null

  const stats = user.studyStats || {
    totalHours: 0,
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    sessionsCompleted: 0,
    studyProgress: 0
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date()
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1 // Monday = 0, Sunday = 6
  const weeklyData = weekDays.map((day, index) => ({
    name: day,
    hours: stats.weeklyHours[index] || 0,
    isToday: index === currentDayIndex
  }))

  const progressData = [
    { name: 'Completed', value: stats.studyProgress },
    { name: 'Remaining', value: 100 - stats.studyProgress }
  ]

  const COLORS = ['#FF6B35', '#FFD93D', '#4ECDC4', '#FF8C61', '#6EDDD6']

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const thisWeekTotal = stats.weeklyHours.reduce((a, b) => a + b, 0)

  const statCards = [
    {
      title: 'Total Study Hours',
      value: `${stats.totalHours.toFixed(1)}h`,
      subtitle: 'All time',
      color: '#FF6B35',
      bgColor: '#FFE5DD',
      clickable: true,
      route: '/analytics'
    },
    {
      title: 'Sessions Completed',
      value: stats.sessionsCompleted,
      subtitle: 'Study sessions',
      color: '#10B981',
      bgColor: '#D1FAE5',
      clickable: false
    },
    {
      title: 'Study Progress',
      value: `${stats.studyProgress}%`,
      subtitle: 'Weekly goal: 20h',
      color: '#4ECDC4',
      bgColor: '#D1F5F3',
      clickable: true,
      route: '/analytics'
    },
    {
      title: 'This Week',
      value: `${thisWeekTotal.toFixed(1)}h`,
      subtitle: 'Weekly hours',
      color: '#FFD93D',
      bgColor: '#FFF9E6',
      clickable: true,
      route: '/analytics'
    }
  ]

  return (
    <div className="dashboard-container">
      <Navigation />
      <div className="dashboard-content">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Welcome back, {user.firstName}! 👋</h1>
            <p>Here's your study overview</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              className={`stat-card ${card.clickable ? 'clickable' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={card.clickable ? { scale: 1.02, y: -4 } : {}}
              onClick={card.clickable ? () => navigate(card.route) : undefined}
              style={{ 
                '--card-color': card.color,
                '--card-bg': card.bgColor
              }}
            >
              <div className="stat-content">
                <h3>{card.title}</h3>
                <p className="stat-value">{card.value}</p>
                {card.subtitle && <p className="stat-subtitle">{card.subtitle}</p>}
                {card.clickable && (
                  <span className="stat-link">View details →</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Study Session Timer */}
        {isTimerRunning && (
          <motion.div
            className="session-timer-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="timer-header">
              <h3> Active Study Session</h3>
              <button
                className="timer-stop-btn"
                onClick={() => {
                  if (timerStartTime) {
                    const hours = (Date.now() - timerStartTime) / (1000 * 60 * 60)
                    if (hours > 0.01) {
                      recordManualStudySession(hours)
                    }
                  }
                  setIsTimerRunning(false)
                  setTimerStartTime(null)
                  setSessionTimer(0)
                }}
              >
                Stop Session
              </button>
            </div>
            <div className="timer-display">
              <span className="timer-time">{formatTime(sessionTimer)}</span>
              <p className="timer-label">Time spent studying</p>
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="charts-grid">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Weekly Study Hours</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isToday ? '#764ba2' : '#FF6B35'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
              <span style={{ color: '#764ba2', fontWeight: 600 }}>Today</span> highlighted
            </p>
          </motion.div>

          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2>Study Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Access Cards */}
        <motion.div
          className="quick-access-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2>Quick Access</h2>
          <div className="quick-access-grid">
            <motion.div
              className="quick-access-card resources"
              onClick={() => navigate('/resources')}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>Learning Resources</h3>
              <p>Explore curated materials for AI, ML, Data Science, and more</p>
              <span className="quick-access-link">Explore →</span>
            </motion.div>
            <motion.div
              className="quick-access-card groups"
              onClick={() => navigate('/groups')}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>Study Groups</h3>
              <p>Join groups automatically created based on your interests</p>
              <span className="quick-access-link">View Groups →</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Top Recommendations Preview */}
        {recommendations.length > 0 && (
          <motion.div
            className="recommendations-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="section-header">
              <h2>Recommended Study Partners</h2>
              <button 
                className="view-more-btn"
                onClick={() => navigate('/recommendations')}
              >
                View More →
              </button>
            </div>
            <div className="recommendations-grid">
              {recommendations.slice(0, 3).map((rec, index) => (
                <motion.div
                  key={rec.id}
                  className="recommendation-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => navigate(`/profile/${rec.id}`)}
                >
                  <div className="rec-avatar">
                    {rec.firstName?.[0]}{rec.lastName?.[0]}
                  </div>
                  <h3>{rec.firstName} {rec.lastName}</h3>
                  <p className="rec-university">{rec.university || 'Student'}</p>
                  <div className="rec-match-score">
                    <span className="match-label">Match Score</span>
                    <span className="match-value">{rec.matchScore}%</span>
                  </div>
                  {rec.csInterests && (
                    <div className="rec-interests">
                      {rec.csInterests.split(',').slice(0, 2).map((interest, i) => (
                        <span key={i} className="interest-tag">
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

