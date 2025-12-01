import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Feedback.css'

function Feedback() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    type: 'general',
    subject: '',
    message: '',
    rating: 0
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [myFeedback, setMyFeedback] = useState([])

  useEffect(() => {
    // Load user's previous feedback
    const allFeedback = JSON.parse(localStorage.getItem('EduConnect_feedback') || '[]')
    const userFeedback = allFeedback.filter(f => f.userId === user?.id)
    setMyFeedback(userFeedback.reverse()) // Most recent first
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const feedback = {
        id: Date.now().toString(),
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        type: formData.type,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        rating: formData.rating,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }

      // Get existing feedback
      const allFeedback = JSON.parse(localStorage.getItem('EduConnect_feedback') || '[]')
      allFeedback.push(feedback)
      localStorage.setItem('EduConnect_feedback', JSON.stringify(allFeedback))

      // Reset form
      setFormData({
        type: 'general',
        subject: '',
        message: '',
        rating: 0
      })
      setSubmitted(true)
      
      // Update my feedback list
      setMyFeedback([feedback, ...myFeedback])

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement Suggestion' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="feedback-container">
      <motion.div
        className="feedback-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="feedback-header">
          <h1>Share Your Feedback</h1>
          <p>We'd love to hear from you! Your feedback helps us improve EduConnect.</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {submitted && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Thank you for your feedback! We appreciate your input.
            </motion.div>
          )}

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <label htmlFor="type">Feedback Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {feedbackTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief summary of your feedback"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please provide detailed feedback..."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Overall Rating (Optional)</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  className={`rating-star ${formData.rating >= star ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </motion.button>
              ))}
              {formData.rating > 0 && (
                <span className="rating-text">
                  {formData.rating === 1 && 'Poor'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            className="submit-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </motion.button>
        </form>

        {myFeedback.length > 0 && (
          <div className="my-feedback-section">
            <h2>Your Previous Feedback</h2>
            <div className="feedback-list">
              {myFeedback.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  className="feedback-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="feedback-item-header">
                    <div className="feedback-meta">
                      <span className="feedback-type">{feedbackTypes.find(t => t.value === feedback.type)?.label}</span>
                      <span className="feedback-date">
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {feedback.rating > 0 && (
                      <div className="feedback-rating-display">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            viewBox="0 0 24 24"
                            fill={i < feedback.rating ? 'currentColor' : 'none'}
                            className={i < feedback.rating ? 'filled' : 'empty'}
                          >
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3>{feedback.subject}</h3>
                  <p>{feedback.message}</p>
                  <span className={`feedback-status ${feedback.status}`}>
                    {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Feedback

