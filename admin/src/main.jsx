
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import DocterContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DocterContextProvider>
        <AppContextProvider>

          <App />

        </AppContextProvider>
      </DocterContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
