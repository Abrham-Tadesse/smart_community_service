import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './app/store'
import './index.css'
import favicon from './assets/image/logo.png'

const setFavicon = () => {
  const existing = document.querySelector("link[rel~='icon']")
  const link = existing || document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/png'
  link.href = favicon
  if (!existing) document.getElementsByTagName('head')[0].appendChild(link)
}
setFavicon()



// Update the initializeMockData function
const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      {
        id: '1',
        name: 'Test Citizen',
        email: 'citizen@example.com',
        password: 'password123',
        phone: '+251911223344',
        role: 'citizen',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Service Officer',
        email: 'officer@example.com',
        password: 'password123',
        phone: '+251922334455',
        role: 'officer',
        department: 'Public Works',
        createdAt: new Date().toISOString()
      },
  {
    id: 'admin-1',
    name: 'Administrator',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin', // ← EXPLICITLY ASSIGNED HERE
    phone: '+251933445566',
    createdAt: new Date().toISOString()
  }
    ]))
  }
  
  // ... rest of your initialization
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