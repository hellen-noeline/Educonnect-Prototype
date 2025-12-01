# EduConnect - Study Partner Platform

A modern React-based platform that helps students find study partners based on similar interests, skills, and preferences. Built with a beautiful Samsung ONE UI 6.0 inspired design.

## Features

- 🔐 **User Authentication**: Secure sign up and login with local storage
- 🎯 **Smart Recommendation System**: AI-powered matching based on:
  - CS and Data Science Interests (primary factor)
  - Technical Skills
  - Soft Skills
  - Research Interests
  - Professional Interests
  - Hobbies
  - Preferred Learning Style
  - Study Partner Preferences
  - Preferred Study Hours
- 📊 **Interactive Dashboard**: Beautiful visualizations showing:
  - Total study hours
  - Weekly study hours (bar chart)
  - Study progress (pie chart)
  - Sessions completed
- 👤 **User Profiles**: Comprehensive profiles with:
  - Bio and personal information
  - Skills and interests
  - Study preferences
  - Editable profile sections
- 👥 **Study Partner Discovery**: 
  - Preview of top 3 recommendations on dashboard
  - Full recommendations page with search and filtering
  - Match score indicators
- 🎨 **Modern UI/UX**: 
  - Samsung ONE UI 6.0 inspired design
  - Smooth animations with Framer Motion
  - Summer color palette
  - Fully responsive design
- 🎉 **Welcome Message**: Animated welcome message on login

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Configure GitHub Pages to serve from the `dist` folder
3. The dataset CSV file is already in the `public` folder and will be included in the build

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.jsx
│   └── WelcomeMessage.jsx
├── contexts/            # React contexts
│   └── AuthContext.jsx
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Recommendations.jsx
│   └── SignUp.jsx
├── styles/              # CSS files
│   ├── Dashboard.css
│   ├── Login.css
│   ├── Navigation.css
│   ├── Profile.css
│   ├── Recommendations.css
│   ├── SignUp.css
│   └── WelcomeMessage.css
├── utils/               # Utility functions
│   ├── datasetLoader.js
│   └── recommendationEngine.js
├── App.jsx
├── index.css
└── main.jsx
```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Recharts** - Chart library for visualizations
- **PapaParse** - CSV parsing for dataset

## Dataset

The platform uses a dataset of 1500 US students with information about:
- Personal details
- Academic information
- Technical and soft skills
- Interests and preferences
- Study habits

The dataset is loaded from `public/us_students_dataset_1500.csv` and combined with registered users for recommendations.

## Recommendation Algorithm

The recommendation system uses a weighted similarity algorithm:

- **CS and Data Science Interests**: 40% weight
- **Technical Skills**: 15% weight
- **Soft Skills**: 10% weight
- **Research Interests**: 10% weight
- **Professional Interests**: 10% weight
- **Hobbies**: 5% weight
- **Preferred Learning Style**: 5% weight
- **Study Partners Preferences**: 3% weight
- **Preferred Study Hours**: 2% weight

Similarity is calculated using Jaccard similarity for categorical data.

## License

This project is open source and available for educational purposes.

