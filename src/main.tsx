import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import { ToastContainer } from 'react-toastify';
import "@radix-ui/themes/styles.css";
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer position='bottom-right' />
    <Theme appearance="dark" radius="medium">
      <App />
    </Theme>
  </StrictMode>,
)
