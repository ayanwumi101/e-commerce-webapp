"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "./use-reduced-motion"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface ScrollRevealOptions {
  threshold?: number
  delay?: number
  duration?: number
  y?: number
  x?: number
  opacity?: number
  scale?: number
  stagger?: number
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()

  const {
    threshold = 0.2,
    delay = 0,
    duration = 0.8,
    y = 50,
    x = 0,
    opacity = 0,
    scale = 1,
    stagger = 0.1,
    once = true,
  } = options

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return

    const element = ref.current
    const children = element.children.length > 0 ? element.children : [element]

    gsap.set(children, {
      y,
      x,
      opacity,
      scale,
    })

    const ctx = gsap.context(() => {
      gsap.to(children, {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: `top ${100 - threshold * 100}%`,
          toggleActions: once ? "play none none none" : "play reverse play reverse",
        },
      })
    }, element)

    return () => ctx.revert()
  }, [prefersReducedMotion, threshold, delay, duration, y, x, opacity, scale, stagger, once])

  return ref
}

export function useParallax<T extends HTMLElement>(speed = 0.5) {
  const ref = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return

    const element = ref.current

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    }, element)

    return () => ctx.revert()
  }, [speed, prefersReducedMotion])

  return ref
}

export function useStaggerReveal<T extends HTMLElement>(selector: string, options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()

  const { delay = 0, duration = 0.6, y = 30, stagger = 0.1 } = options

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return

    const element = ref.current
    const items = element.querySelectorAll(selector)

    if (items.length === 0) return

    gsap.set(items, { y, opacity: 0 })

    const ctx = gsap.context(() => {
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
        },
      })
    }, element)

    return () => ctx.revert()
  }, [selector, prefersReducedMotion, delay, duration, y, stagger])

  return ref
}
