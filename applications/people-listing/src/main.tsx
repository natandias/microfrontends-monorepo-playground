import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PeopleApp from './PeopleApp.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PeopleApp />
  </StrictMode>,
)
