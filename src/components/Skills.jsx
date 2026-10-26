import { useEffect, useRef, useState } from 'react'
import { skills } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import { gsap, useGSAP } from '../lib/motion.js'

const coreTools = ['FastAPI', 'FastGPT', 'LangChain', 'RAGFlow', 'n8n', 'Docker']
const deliverySteps = ['Scope', 'Build', 'Evaluate', 'Deploy']

export default function Skills() {
  const headRef = useReveal()
  const sectionRef = useRef(null)
  const deliveryRef = useRef(null)
  const [isActive, setIsActive] = useState(false)

  useGSAP(() => {
    const media = gsap.matchMedia()
    const steps = deliveryRef.current.querySelectorAll('.skills__delivery-step')
    const progress = deliveryRef.current

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const loop = gsap.timeline({ paused: true, repeat: -1 })
        .set(steps, { attr: { 'data-lit': 'false' } }, 0)
        .set(progress, { '--delivery-progress': 0 }, 0)

      steps.forEach((step, index) => {
        loop.set(step, { attr: { 'data-lit': 'true' } }, index * 0.5)
        if (index > 0) {
          loop.to(progress, {
            '--delivery-progress': index / (steps.length - 1), duration: 0.35, ease: 'power1.inOut',
          }, index * 0.5)
        }
      })
      // Four half-second beats, then start again at Scope.
      loop.set(steps, { attr: { 'data-lit': 'false' } }, steps.length * 0.5)

      let visible = false
      const syncPlayback = () => {
        if (visible && !document.hidden) loop.resume()
        else loop.pause()
      }
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        syncPlayback()
      }, { threshold: 0.2 })
      observer.observe(deliveryRef.current)
      document.addEventListener('visibilitychange', syncPlayback)
      return () => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', syncPlayback)
      }
    })
    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(steps, { attr: { 'data-lit': 'true' } })
      gsap.set(progress, { '--delivery-progress': 1 })
    })
    return () => media.revert()
  }, { scope: deliveryRef })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      className={`section skills ${isActive ? 'skills--active' : ''}`}
      ref={sectionRef}
    >
      <div className="container">
        <div className="section__head reveal" ref={headRef}>
          <span className="section__index">03</span>
          <h2 className="section__title"><span className="text-gradient">Skills</span></h2>
          <span className="section__en">TECH&nbsp;STACK</span>
        </div>

        <div className="skills__shell">
          <div className="skills__intro">
            <span className="skills__eyebrow">AI ENGINEERING &amp; DELIVERY</span>
            <p>
              Practical capabilities in AI agents, retrieval systems, workflow
              automation, API integration, evaluation, and deployment.
            </p>

            <div className="skills__details">
              <div className="skills__detail-block">
                <h3 className="skills__detail-title" id="skills-tools-title">
                  Core tools
                </h3>
                <ul className="skills__tools" aria-labelledby="skills-tools-title">
                  {coreTools.map((tool) => (
                    <li className="skills__tool" key={tool}>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="skills__detail-block">
                <h3 className="skills__detail-title" id="skills-delivery-title">
                  How I deliver
                </h3>
                <ol
                  className="skills__delivery"
                  ref={deliveryRef}
                  aria-labelledby="skills-delivery-title"
                >
                  {deliverySteps.map((step) => (
                    <li className="skills__delivery-step" key={step}>
                      <span className="skills__delivery-node" aria-hidden="true" />
                      <span className="skills__delivery-label">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <a className="skills__work-link" href="#projects">
              <span>Explore related work</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </div>

          <ul className="skills__list" aria-label="AI engineering and delivery capabilities">
            {skills.map((skill, index) => (
              <li
                className="skill-row"
                key={skill.name}
                style={{
                  '--skill-scale': skill.value === null ? 0 : skill.value / 100,
                  '--skill-delay': `${index * 90}ms`,
                }}
              >
                <div className="skill-row__meta">
                  <h3 className="skill-row__name">
                    <span className="text-gradient">{skill.name}</span>
                  </h3>
                  <span className="skill-row__value">
                    <span className="text-gradient">
                      {skill.value === null ? '—' : `${skill.value}%`}
                    </span>
                  </span>
                </div>
                <div
                  className="skill-row__track"
                  role="progressbar"
                  aria-label={skill.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.value === null ? undefined : skill.value}
                  aria-valuetext={skill.value === null ? 'Not rated' : `${skill.value}%`}
                >
                  <span className="skill-row__bar" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
