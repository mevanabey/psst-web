"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface ScrambleHoverProps {
  text: string
  scrambleSpeed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: "start" | "end" | "center"
  useOriginalCharsOnly?: boolean
  characters?: string
  className?: string
  scrambledClassName?: string
  glowColor?: string
}

const ScrambleHover: React.FC<ScrambleHoverProps> = ({
  text,
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className,
  scrambledClassName,
  sequential = false,
  revealDirection = "start",
  glowColor = "rgba(255, 255, 255, 0.8)",
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>())

  useEffect(() => {
    let interval: NodeJS.Timeout
    let currentIteration = 0

    const getNextIndex = () => {
      const textLength = text.length
      switch (revealDirection) {
        case "start":
          return revealedIndices.size
        case "end":
          return textLength - 1 - revealedIndices.size
        case "center":
          const middle = Math.floor(textLength / 2)
          const offset = Math.floor(revealedIndices.size / 2)
          const nextIndex =
            revealedIndices.size % 2 === 0
              ? middle + offset
              : middle - offset - 1

          if (
            nextIndex >= 0 &&
            nextIndex < textLength &&
            !revealedIndices.has(nextIndex)
          ) {
            return nextIndex
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedIndices.has(i)) return i
          }
          return 0
        default:
          return revealedIndices.size
      }
    }

    const shuffleText = (text: string) => {
      if (useOriginalCharsOnly) {
        const positions = text.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: revealedIndices.has(i),
        }))

        const nonSpaceChars = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char)

        // Shuffle remaining non-revealed, non-space characters
        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[nonSpaceChars[i], nonSpaceChars[j]] = [
            nonSpaceChars[j],
            nonSpaceChars[i],
          ]
        }

        let charIndex = 0
        return positions
          .map((p) => {
            if (p.isSpace) return " "
            if (p.isRevealed) return text[p.index]
            return nonSpaceChars[charIndex++]
          })
          .join("")
      } else {
        return text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (revealedIndices.has(i)) return text[i]
            return availableChars[
              Math.floor(Math.random() * availableChars.length)
            ]
          })
          .join("")
      }
    }

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("")

    if (isHovering || isTouched) {
      setIsScrambling(true)
      interval = setInterval(() => {
        if (sequential) {
          if (revealedIndices.size < text.length) {
            const nextIndex = getNextIndex()
            revealedIndices.add(nextIndex)
            setDisplayText(shuffleText(text))
          } else {
            clearInterval(interval)
            setIsScrambling(false)
          }
        } else {
          setDisplayText(shuffleText(text))
          currentIteration++
          if (currentIteration >= maxIterations) {
            clearInterval(interval)
            setIsScrambling(false)
            setDisplayText(text)
          }
        }
      }, scrambleSpeed)
    } else {
      setDisplayText(text)
      revealedIndices.clear()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    isHovering,
    isTouched,
    text,
    characters,
    scrambleSpeed,
    useOriginalCharsOnly,
    sequential,
    revealDirection,
    maxIterations,
    revealedIndices,
    setRevealedIndices
  ])

  return (
    <motion.span
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onTapStart={() => setIsTouched(true)}
      onTap={() => {
        setTimeout(() => setIsTouched(false), 1500)
      }}
      style={{
        textShadow: (isHovering || isTouched) ? `0 0 8px ${glowColor}` : 'none',
        transition: 'text-shadow 0.3s ease, transform 0.3s ease, letter-spacing 0.3s ease',
        transform: (isHovering || isTouched) ? 'translateY(-2px)' : 'translateY(0)',
        letterSpacing: (isHovering || isTouched) ? '0.05em' : 'normal',
        position: 'relative',
      }}
      className={cn("inline-block whitespace-pre-wrap relative", className)}
      {...props}
    >
      <span className="sr-only">{displayText}</span>
      <span 
        aria-hidden="true"
        className="relative z-10"
      >
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              revealedIndices.has(index) || !isScrambling || (!isHovering && !isTouched)
                ? className
                : scrambledClassName
            )}
          >
            {char}
          </span>
        ))}
      </span>
      {(isHovering || isTouched) && (
        <motion.span 
          className="absolute inset-0 -z-10 bg-white/5 rounded-md blur-xl" 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.15, scale: 1.1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.span>
  )
}

export default ScrambleHover
