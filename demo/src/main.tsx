import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider, StandaloneToastContainer } from '@prmichaelsen/pretty-toasts/standalone'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <StandaloneToastContainer />
    </ToastProvider>
  </React.StrictMode>,
)
