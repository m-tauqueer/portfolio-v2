import { useCallback, useEffect, useState } from 'react'
import type { PortfolioData } from '../../types/portfolio'
import '../../styles/intro.css'

interface IntroSequenceProps {
  data: PortfolioData | null
  onComplete: () => void
}

type IntroStep = 'idle' | 'name' | 'role' | 'tags' | 'exit'

const TIMING = {
  name: 300,
  role: 1200,
  tags: 2000,
  exit: 3200,
} as const

export function IntroSequence({ data, onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState<IntroStep>('idle')
  const [exiting, setExiting] = useState(false)

  const profile = data?.profile
  const name = profile?.name ?? 'Mohammad Tauqueer'
  const role = profile?.title ?? 'Software Engineer'
  const location = profile?.location ?? 'Bangalore'

  const finish = useCallback(() => {
    setExiting(true)
    window.setTimeout(onComplete, 650)
  }, [onComplete])

  const skip = useCallback(() => {
    finish()
  }, [finish])

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep('name'), TIMING.name),
      window.setTimeout(() => setStep('role'), TIMING.role),
      window.setTimeout(() => setStep('tags'), TIMING.tags),
      window.setTimeout(() => {
        setStep('exit')
        finish()
      }, TIMING.exit),
    ]

    return () => timers.forEach(clearTimeout)
  }, [finish])

  const stepAtLeast = (target: IntroStep) => {
    const order: IntroStep[] = ['idle', 'name', 'role', 'tags', 'exit']
    return order.indexOf(step) >= order.indexOf(target)
  }

  return (
    <div className={`intro-screen ${exiting ? 'intro-screen--exit' : ''}`} role="dialog" aria-label="Introduction">
      <div className="intro-noise" aria-hidden="true" />
      <div className="intro-scanlines" aria-hidden="true" />

      <button type="button" className="intro-skip" onClick={skip}>
        Skip intro
      </button>

      <div className="intro-content">
        <h1
          className={`intro-name ${stepAtLeast('name') ? 'intro-name--visible' : ''}`}
          data-text={name.toUpperCase()}
        >
          {name.toUpperCase()}
        </h1>

        <p className={`intro-role ${stepAtLeast('role') ? 'intro-role--visible' : ''}`}>
          [ {role} ] · {location}
        </p>

        <div className={`intro-tags ${stepAtLeast('tags') ? 'intro-tags--visible' : ''}`}>
          <span className="intro-tag">Metacognition</span>
          <span className="intro-tag">BITS Pilani</span>
        </div>
      </div>

      {!exiting && <div className="intro-progress" aria-hidden="true" />}
    </div>
  )
}
