import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './app/store'
import './index.css'

// Initialize mock data if not exists
const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+251911223344',
        role: 'citizen',
        createdAt: new Date().toISOString()
      }
    ]))
  }
  
  if (!localStorage.getItem('issues')) {
    localStorage.setItem('issues', JSON.stringify([
      {
        id: '1',
        title: 'Water Supply Disruption',
        category: 'water',
        description: 'No water supply in the entire neighborhood for the past 48 hours.',
        severity: 'critical',
        priorityScore: 9,
        status: 'in_progress',
        location: 'Bole, Addis Ababa',
        affectedPeople: 150,
        durationHours: 48,
        areaImportance: 'high',
        reportedBy: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: '2024-01-15T08:30:00Z'
      },
      {
        id: '2',
        title: 'Street Light Not Working',
        category: 'electricity',
        description: 'Street light pole #45 has been dark for 2 weeks.',
        severity: 'medium',
        priorityScore: 6,
        status: 'submitted',
        location: 'Churchill Road, Addis Ababa',
        affectedPeople: 50,
        durationHours: 336,
        areaImportance: 'medium',
        reportedBy: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: '2024-01-14T14:20:00Z'
      }
    ]))
  }
}

// Initialize data before rendering
initializeMockData()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)