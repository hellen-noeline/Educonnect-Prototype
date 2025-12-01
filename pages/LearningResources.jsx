import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navigation from '../components/Navigation'
import '../styles/LearningResources.css'

function LearningResources() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'ai', name: 'Artificial Intelligence' },
    { id: 'ml', name: 'Machine Learning' },
    { id: 'ds', name: 'Data Science' },
    { id: 'nlp', name: 'Natural Language Processing' },
    { id: 'cv', name: 'Computer Vision' },
    { id: 'dl', name: 'Deep Learning' },
    { id: 'cyber', name: 'Cybersecurity' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Development' }
  ]

  const learningResources = [
    {
      id: 1,
      title: 'Introduction to Artificial Intelligence',
      category: 'ai',
      type: 'Course',
      provider: 'Coursera',
      description: 'Comprehensive course covering AI fundamentals, search algorithms, and problem-solving techniques.',
      link: 'https://www.coursera.org/learn/ai',
      difficulty: 'Beginner',
      duration: '6 weeks',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Machine Learning by Andrew Ng',
      category: 'ml',
      type: 'Course',
      provider: 'Coursera',
      description: 'The most popular ML course covering supervised learning, neural networks, and more.',
      link: 'https://www.coursera.org/learn/machine-learning',
      difficulty: 'Intermediate',
      duration: '11 weeks',
      rating: 4.9
    },
    {
      id: 3,
      title: 'Deep Learning Specialization',
      category: 'dl',
      type: 'Specialization',
      provider: 'Coursera',
      description: 'Master deep learning, neural networks, and build AI applications.',
      link: 'https://www.coursera.org/specializations/deep-learning',
      difficulty: 'Advanced',
      duration: '5 months',
      rating: 4.8
    },
    {
      id: 4,
      title: 'Data Science with Python',
      category: 'ds',
      type: 'Course',
      provider: 'edX',
      description: 'Learn data analysis, visualization, and machine learning with Python.',
      link: 'https://www.edx.org/course/data-science',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      rating: 4.7
    },
    {
      id: 5,
      title: 'Natural Language Processing with Deep Learning',
      category: 'nlp',
      type: 'Course',
      provider: 'Stanford Online',
      description: 'Advanced NLP techniques using deep learning models.',
      link: 'https://online.stanford.edu/courses/cs224n-natural-language-processing-deep-learning',
      difficulty: 'Advanced',
      duration: '10 weeks',
      rating: 4.9
    },
    {
      id: 6,
      title: 'Computer Vision Basics',
      category: 'cv',
      type: 'Course',
      provider: 'Udacity',
      description: 'Introduction to image processing and computer vision algorithms.',
      link: 'https://www.udacity.com/course/computer-vision-nanodegree',
      difficulty: 'Intermediate',
      duration: '3 months',
      rating: 4.6
    },
    {
      id: 7,
      title: 'Cybersecurity Fundamentals',
      category: 'cyber',
      type: 'Course',
      provider: 'Coursera',
      description: 'Learn about network security, cryptography, and ethical hacking.',
      link: 'https://www.coursera.org/learn/cybersecurity-fundamentals',
      difficulty: 'Beginner',
      duration: '4 weeks',
      rating: 4.7
    },
    {
      id: 8,
      title: 'Full Stack Web Development',
      category: 'web',
      type: 'Bootcamp',
      provider: 'freeCodeCamp',
      description: 'Complete web development course covering frontend and backend technologies.',
      link: 'https://www.freecodecamp.org/learn',
      difficulty: 'Beginner',
      duration: 'Self-paced',
      rating: 4.8
    },
    {
      id: 9,
      title: 'iOS Development with Swift',
      category: 'mobile',
      type: 'Course',
      provider: 'Apple Developer',
      description: 'Build iOS apps using Swift and SwiftUI.',
      link: 'https://developer.apple.com/learn/',
      difficulty: 'Intermediate',
      duration: 'Self-paced',
      rating: 4.7
    },
    {
      id: 10,
      title: 'TensorFlow for Deep Learning',
      category: 'ml',
      type: 'Tutorial',
      provider: 'TensorFlow',
      description: 'Hands-on tutorials for building ML models with TensorFlow.',
      link: 'https://www.tensorflow.org/learn',
      difficulty: 'Intermediate',
      duration: 'Self-paced',
      rating: 4.8
    },
    {
      id: 11,
      title: 'Reinforcement Learning',
      category: 'ai',
      type: 'Course',
      provider: 'Udacity',
      description: 'Learn about Q-learning, policy gradients, and RL algorithms.',
      link: 'https://www.udacity.com/course/reinforcement-learning',
      difficulty: 'Advanced',
      duration: '4 months',
      rating: 4.7
    },
    {
      id: 12,
      title: 'Data Visualization with D3.js',
      category: 'ds',
      type: 'Course',
      provider: 'Udemy',
      description: 'Create interactive data visualizations using D3.js.',
      link: 'https://www.udemy.com/topic/d3js/',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      rating: 4.6
    }
  ]

  const filteredResources = selectedCategory === 'all' 
    ? learningResources 
    : learningResources.filter(resource => resource.category === selectedCategory)

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return '#10B981'
      case 'intermediate': return '#FFD93D'
      case 'advanced': return '#FF6B35'
      default: return '#6B7280'
    }
  }

  return (
    <div className="resources-container">
      <Navigation />
      <div className="resources-content">
        <motion.div
          className="resources-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Learning Resources</h1>
            <p>Discover curated learning materials tailored to your interests</p>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="category-filter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="category-name">{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="resources-grid">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              className="resource-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            >
              <div className="resource-header">
                <div className="resource-type-badge">{resource.type}</div>
                <div className="resource-rating">
                  <svg className="rating-star-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  <span>{resource.rating}</span>
                </div>
              </div>
              
              <h3>{resource.title}</h3>
              <p className="resource-provider">by {resource.provider}</p>
              <p className="resource-description">{resource.description}</p>
              
              <div className="resource-meta">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(resource.difficulty) + '20', color: getDifficultyColor(resource.difficulty) }}
                >
                  {resource.difficulty}
                </span>
                <span className="duration-badge">
                  {resource.duration}
                </span>
              </div>
              
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                View Resource →
              </a>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <motion.div
            className="no-resources"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No resources found for this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LearningResources

