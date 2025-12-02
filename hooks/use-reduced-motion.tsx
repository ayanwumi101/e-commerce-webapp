"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

const ReducedMotionContext = createContext(false)

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return <ReducedMotionContext.Provider value={prefersReducedMotion}>{children}</ReducedMotionContext.Provider>
}

export function useReducedMotion() {
  return useContext(ReducedMotionContext)
}
