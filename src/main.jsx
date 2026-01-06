import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/ui/app-sidebar';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <header className="flex items-center border-b p-2">
              <SidebarTrigger />
            </header>
            <div className="p-6">
              <App />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>,
)