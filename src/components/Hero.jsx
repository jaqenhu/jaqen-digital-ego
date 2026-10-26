import { useEffect, useRef, useState } from 'react'
import { profile } from '../data.js'
import { gsap, useGSAP } from '../lib/motion.js'
import HeroBackground from './HeroBackground.jsx'

const roles = [
  'AI Engineer',
  'Agent Developer',
  'RAG & Enterprise Solution Builder',
]

export default function Hero() {
  const sectionRef = useRef(null)
  const introRef = useRef(null)
  const [roleIndex, setRoleIndex] = useState(0)
  const [typedRole, setTypedRole] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      // A restored scroll position or section link should not replay an unseen intro.
      if (sectionRef.current.getBoundingClientRect().bottom <= 0) return

      const select = gsap.utils.selector(sectionRef)
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } }).timeScale(0.5)
      introRef.current = intro
      intro
        .from(select('.hero__kicker'), { autoAlpha: 0, y: 8, duration: 0.3 }, 0)
        .from(select('.hero__kicker-line'), {
          scaleX: 0, transformOrigin: 'left center', duration: 0.45,
        }, 0)
        .from(select('.hero__title-text'), { yPercent: 108, duration: 0.7 }, 0.1)
        .from(select('.hero__role-line'), { autoAlpha: 0, y: 16, duration: 0.5 }, 0.28)
        .from(select('.hero__subtitle'), { autoAlpha: 0, y: 14, duration: 0.5 }, 0.38)
        .from(select('.hero__actions'), { autoAlpha: 0, y: 10, duration: 0.4 }, 0.5)
        .from(select('.hero__portrait-img'), {
          autoAlpha: 0, scale: 1.035, y: 16, duration: 0.85,
        }, 0.2)
        .from(select('.hero__portrait-aura'), {
          autoAlpha: 0, scale: 0.94, duration: 0.8,
        }, 0.2)
      return () => { introRef.current = null }
    })
    return () => media.revert()
  }, { scope: sectionRef })

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', onChange)
    return () => preference.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const currentRole = roles[roleIndex]
    const isComplete = typedRole === currentRole
    const isEmpty = typedRole === ''

    const delay = isComplete && !isDeleting ? 2000 : isDeleting ? 42 : 72

    const timer = window.setTimeout(() => {
      if (!isDeleting && !isComplete) {
        setTypedRole(currentRole.slice(0, typedRole.length + 1))
        return
      }

      if (!isDeleting && isComplete) {
        setIsDeleting(true)
        return
      }

      if (isDeleting && !isEmpty) {
        setTypedRole(currentRole.slice(0, typedRole.length - 1))
        return
      }

      setIsDeleting(false)
      setRoleIndex((index) => (index + 1) % roles.length)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [isDeleting, roleIndex, typedRole, reducedMotion])

  return (
    <section
      id="home"
      className="hero"
      ref={sectionRef}
      onFocusCapture={() => introRef.current?.progress(1)}
    >
      <div className="hero__media" aria-hidden="true">
        <HeroBackground />
        <div className="hero__grid" />
        <div className="hero__glow" />
        <div className="hero__overlay" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__content container">
        <div className="hero__text">
          <p className="hero__kicker">
            <span className="hero__kicker-line" />
            {profile.handle} - {profile.location}
          </p>
          <h1 className="hero__title">
            <span className="hero__title-mask">
              <span className="hero__title-text text-gradient">Hello, I'm Jaqen HU</span>
            </span>
          </h1>
          <p className="hero__role-line">
            <span className="hero__role-prefix text-gradient">A </span>
            <span className="hero__typed-role">
              {reducedMotion ? roles[0] : typedRole}
            </span>
            <span className="hero__type-cursor" aria-hidden="true">
              |
            </span>
          </p>
          <p className="hero__subtitle">
            Building AI agents and retrieval systems for enterprise workflows,
            combining system integration, evaluation, and practical deployment.
          </p>
          <div className="hero__actions">
            <a href="#projects" className="btn btn--solid">
              View Work
            </a>
            <a href="#contact" className="btn btn--outline">
              <span className="text-gradient">Get in Touch</span>
            </a>
          </div>
        </div>

        <div className="hero__portrait">
          <div className="hero__portrait-aura" aria-hidden="true" />
          <img
            src="/portrait.png"
            alt={`${profile.name} — ${profile.role}`}
            className="hero__portrait-img"
          />
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span>SCROLL</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
