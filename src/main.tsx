import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './prototypes'
import { RouterProvider } from 'react-router-dom'
import { router } from "./router"
import { Toaster } from '@/components/ui/toaster'
import {colors} from "@/lib/colors.ts";

colors.setBackgroundColor('bg-slate-50')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
)
