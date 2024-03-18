import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './prototypes'
import { RouterProvider } from 'react-router-dom'
import { router } from "./router"
import { Toaster } from '@/components/ui/toaster'
import {AuthContextProvider} from "@/contexts/AuthContextProvider.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AuthContextProvider>
          <>
              <RouterProvider router={router} />
              <Toaster />
          </>
      </AuthContextProvider>
  </React.StrictMode>,
)