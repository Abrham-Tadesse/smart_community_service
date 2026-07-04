import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './app/store'
import './index.css'
import favicon from './assets/image/logo.png'
import { AuthProvider } from './context/AuthContext'


const setFavicon = () => {
  const existing = document.querySelector("link[rel~='icon']")
  const link = existing || document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/png'
  link.href = favicon
  if (!existing) document.getElementsByTagName('head')[0].appendChild(link)
}
setFavicon()



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    </AuthProvider>
  </React.StrictMode>
)