import { useCallback, useRef, useState } from 'react'
import { projects } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import { gsap, useGSAP } from '../lib/motion.js'
import ProjectModal from './ProjectModal.jsx'

function ProjectCard({ project, index, onOpen }) {
  const ref = useRef(null)
  const mediaRef = useRef(null)
  const entranceRef = useRef(null)
  const hasEnteredRef = useRef(false)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add({
      all: 'all',
      wide: '(min-width: 861px)',
      desktop: '(min-width: 861px) and (hover: hover) and (pointer: fine)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, ({ conditions }) => {
      if (conditions.reduced) return
      const select = gsap.utils.selector(ref)
      if (!hasEnteredRef.current) {
        const imageDirection = conditions.wide && index % 2 === 1 ? 1 : -1
        const distance = () => Math.min(ref.current.clientWidth * 0.3, conditions.wide ? 220 : 100)
        const entrance = gsap.timeline({
          defaults: { duration: 1.5, ease: 'power3.out' },
          scrollTrigger: { trigger: ref.current, start: 'top 86%', once: true },
          onComplete: () => {
            hasEnteredRef.current = true
            gsap.set([
              mediaRef.current,
              ...select('.project-card__body'),
            ], { clearProps: 'opacity,visibility,transform' })
          },
        })
        entranceRef.current = entrance
        entrance
          .from(mediaRef.current, {
            x: () => imageDirection * distance(), autoAlpha: 0,
          }, 0)
          .from(select('.project-card__body'), {
            x: () => -imageDirection * distance(), autoAlpha: 0,
          }, 0)
      }

      if (conditions.desktop) {
        gsap.fromTo(select('.project-card__image-motion'), { y: -12, scale: 1.08 }, {
          y: 12, scale: 1.08, ease: 'none',
          scrollTrigger: {
            trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true,
          },
        })
      }
      return () => { entranceRef.current = null }
    })
    return () => media.revert()
  }, { scope: ref })

  const open = (event) => {
    entranceRef.current?.progress(1)
    onOpen(project, mediaRef.current, event.currentTarget)
  }

  return (
    <article
      className="project-card"
      ref={ref}
      onFocusCapture={() => entranceRef.current?.progress(1)}
    >
      <button
        className="project-card__media"
        type="button"
        ref={mediaRef}
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`View details for ${project.title}`}
      >
        <span className="project-card__image-motion">
          <img src={project.image} alt="" loading="lazy" />
        </span>
      </button>

      <div className="project-card__body">
        <h3 className="project-card__title">
          <button type="button" onClick={open} aria-haspopup="dialog">
            <span className="text-gradient">{project.title}</span>
          </button>
        </h3>

        <span className="project-card__tech-label">Tech Stack</span>
        <ul className="project-card__tags" aria-label={`${project.title} technology stack`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function Projects() {
  const ref = useReveal()
  const [activeProject, setActiveProject] = useState(null)
  const openProject = useCallback((project, source, opener) => {
    setActiveProject({ project, source, opener })
  }, [])
  const closeProject = useCallback(() => setActiveProject(null), [])

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section__head reveal" ref={ref}>
          <span className="section__index">02</span>
          <h2 className="section__title"><span className="text-gradient">Selected Work</span></h2>
          <div className="projects__heading-note">
            <span className="section__en">SELECTED&nbsp;WORKS</span>
            <p className="projects__hint">Click to view details</p>
          </div>
        </div>

        <div className="projects__list">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={openProject} />
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal {...activeProject} onClose={closeProject} />
      )}
    </section>
  )
}
