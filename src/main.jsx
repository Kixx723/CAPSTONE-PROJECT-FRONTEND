import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
    <Router>
      <App />
    </Router>
    <ToastContainer />
    </AuthContextProvider>
)
