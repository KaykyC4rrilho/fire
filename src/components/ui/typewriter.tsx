"use client"

import { useEffect, useState } from 'react'

interface TypewriterProps {
  words: string[]
  speed?: number
  delayBetweenWords?: number
  fadeDuration?: number
  loop?: boolean
  cursor?: boolean
  cursorChar?: string
}

export function Typewriter({
  words,
  speed = 100,
  delayBetweenWords = 2000,
  fadeDuration = 300,
  loop = true,
  cursor = true,
  cursorChar = '|',
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  const currentWord = words[wordIndex] ?? ''

  useEffect(() => {
    if (!words.length) return

    let fadeTimeout: number | undefined
    const timeout = window.setTimeout(
      () => {
        if (charIndex < currentWord.length) {
          setIsVisible(true)
          setDisplayText(currentWord.substring(0, charIndex + 1))
          setCharIndex(charIndex + 1)
          return
        }

        const isLastWord = wordIndex === words.length - 1

        if (isLastWord && !loop) {
          return
        }

        setIsVisible(false)
        fadeTimeout = window.setTimeout(() => {
          setDisplayText('')
          setCharIndex(0)
          setWordIndex((prev) => (prev + 1) % words.length)
        }, fadeDuration)
      },
      charIndex < currentWord.length ? speed : delayBetweenWords,
    )

    return () => {
      window.clearTimeout(timeout)
      if (fadeTimeout) {
        window.clearTimeout(fadeTimeout)
      }
    }
  }, [charIndex, currentWord, speed, delayBetweenWords, fadeDuration, loop, wordIndex, words.length])

  useEffect(() => {
    if (!cursor) return

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [cursor])

  return (
    <div
      className="inline-block transition-opacity ease-out"
      style={{ opacity: isVisible ? 1 : 0, transitionDuration: `${fadeDuration}ms` }}
    >
      <span>
        {displayText}
        {cursor && (
          <span className="ml-1 transition-opacity duration-75" style={{ opacity: showCursor ? 1 : 0 }}>
            {cursorChar}
          </span>
        )}
      </span>
    </div>
  )
}
