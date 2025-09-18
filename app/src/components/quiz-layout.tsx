"use client"

import type { ReactNode } from "react"

interface QuizLayoutProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
}

export function QuizLayout({ children, title = "QuizMaster", showHeader = true }: QuizLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
          </div>
        </header>
      )}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
