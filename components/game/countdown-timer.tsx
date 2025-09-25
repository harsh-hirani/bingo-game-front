"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  targetDate: string
  onComplete?: () => void
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        onComplete?.()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const formatTime = (time: number) => time.toString().padStart(2, "0")

  return (
    <div className="flex items-center gap-2 text-primary">
      <Clock size={20} />
      <div className="flex items-center gap-1 font-mono text-lg font-bold">
        {timeLeft.days > 0 && (
          <>
            <span className="bg-primary/10 px-2 py-1 rounded">{formatTime(timeLeft.days)}</span>
            <span>:</span>
          </>
        )}
        <span className="bg-primary/10 px-2 py-1 rounded">{formatTime(timeLeft.hours)}</span>
        <span>:</span>
        <span className="bg-primary/10 px-2 py-1 rounded">{formatTime(timeLeft.minutes)}</span>
        <span>:</span>
        <span className="bg-primary/10 px-2 py-1 rounded">{formatTime(timeLeft.seconds)}</span>
      </div>
    </div>
  )
}
