"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { NavLink } from "react-router-dom"

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please <NavLink className={'text-primary hover:underline'} to="/auth/login">login</NavLink> to continue</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
