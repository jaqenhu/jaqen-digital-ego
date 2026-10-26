import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { Flip, gsap, useGSAP } from '../lib/motion.js'

export default function ProjectModal({ project, source, opener, onClose }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const imageRef = useRef(null)
  const closeButtonRef = useRef(null)
  const requestCloseRef = useRef(() => {})
  const sourceImage = source?.querySelector('img')

  useGSAP((context, contextSafe) => {
    const overlay = overlayRef.current
    const dialog = dialogRef.current
    const image = imageRef.current
    const backdrop = overlay.querySelector('.project-modal__backdrop')
    const content = overlay.querySelector('.project-modal__content')
    const sourceLayer = source?.querySelector('.project-card__image-motion')
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const appRoot = document.getElementById('root')
    const previous = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      inert: appRoot?.inert,
      sourceVisibility: sourceLayer?.style.visibility,
    }
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    if (appRoot) appRoot.inert = true

    let phase = 'opening'
    let ghost = null
    let exit = null
    const canShareImage = !preference.matches && sourceImage?.complete && sourceImage.naturalWidth > 0
    const sourceFilter = sourceImage ? getComputedStyle(sourceImage).filter : 'none'
    const destinationFilter = getComputedStyle(image).filter

    // A disposable cover travels above both layouts; React keeps ownership of each real image.
    if (canShareImage) {
      ghost = document.createElement('div')
      ghost.className = 'project-transition'
      ghost.setAttribute('aria-hidden', 'true')
      const ghostImage = document.createElement('img')
      ghostImage.src = project.image
      ghostImage.alt = ''
      ghostImage.style.filter = sourceFilter
      ghost.append(ghostImage)
      document.body.append(ghost)
      Flip.fit(ghost, source)
      if (sourceLayer) sourceLayer.style.visibility = 'hidden'
      gsap.set(image, { visibility: 'hidden' })
    }

    const settleOpen = contextSafe(() => {
      phase = 'open'
      overlay.dataset.state = 'open'
      gsap.set(image, { visibility: 'visible' })
      if (ghost) gsap.set(ghost, { autoAlpha: 0 })
    })
    overlay.dataset.state = phase
    const enter = gsap.timeline({ onComplete: settleOpen }).timeScale(0.5)
      .from(backdrop, { opacity: 0, duration: preference.matches ? 0.12 : 0.3 }, 0)
      .from(dialog, { opacity: 0, duration: preference.matches ? 0.12 : 0.3 }, 0)

    if (ghost) {
      enter.add(Flip.fit(ghost, image, {
        duration: 0.62, ease: 'power3.inOut', paused: true,
      }).play(), 0)
        .to(ghost.firstElementChild, { filter: destinationFilter, duration: 0.55 }, 0)
        .from(content, { autoAlpha: 0, y: 12, duration: 0.35, ease: 'power3.out' }, 0.25)
    } else if (!preference.matches) {
      enter.from(content, { autoAlpha: 0, y: 10, duration: 0.3 }, 0.08)
    }

    const finishClose = () => {
      if (sourceLayer) sourceLayer.style.visibility = previous.sourceVisibility
      onClose()
    }
    const requestClose = contextSafe(() => {
      if (phase === 'closing') return
      const wasOpening = phase === 'opening'
      phase = 'closing'
      overlay.dataset.state = phase
      enter.kill()

      const sourceRect = source?.getBoundingClientRect()
      const canReturn = ghost && !preference.matches && source?.isConnected
        && sourceRect.width > 0 && sourceRect.bottom > 0 && sourceRect.top < window.innerHeight

      if (canReturn) {
        // If interrupted during entry, return from the actual in-flight position.
        if (!wasOpening) Flip.fit(ghost, image)
        gsap.set(ghost, { autoAlpha: 1 })
        gsap.set(image, { visibility: 'hidden' })
      } else if (ghost) {
        gsap.set(ghost, { autoAlpha: 0 })
        gsap.set(image, { visibility: 'visible' })
      }

      exit = gsap.timeline({ onComplete: finishClose })
        .to(content, { opacity: 0, duration: preference.matches ? 0.1 : 0.16 }, 0)
        .to(dialog, { opacity: 0, duration: preference.matches ? 0.12 : 0.25 }, 0.04)
        .to(backdrop, { opacity: 0, duration: preference.matches ? 0.12 : 0.3 }, 0.04)
      if (canReturn) {
        exit.add(Flip.fit(ghost, source, {
          duration: 0.42, ease: 'power3.inOut', paused: true,
        }).play(), 0)
          .to(ghost.firstElementChild, { filter: sourceFilter, duration: 0.35 }, 0)
      }
    })
    requestCloseRef.current = requestClose

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
      }
      if (event.key === 'Tab') {
        const focusable = [...dialog.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        )].filter(element => element.getClientRects().length > 0)
        const first = focusable[0]
        const last = focusable.at(-1)
        if (!first) {
          event.preventDefault()
          dialog.focus({ preventScroll: true })
        } else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault()
          last.focus({ preventScroll: true })
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault()
          first.focus({ preventScroll: true })
        }
      }
    }
    const onFocusIn = (event) => {
      if (!dialog.contains(event.target)) closeButtonRef.current?.focus({ preventScroll: true })
    }
    const settleTransition = () => {
      if (phase === 'opening') enter.progress(1)
      else if (phase === 'closing') exit?.progress(1)
    }
    const onPreferenceChange = () => {
      if (preference.matches) settleTransition()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', settleTransition)
    document.addEventListener('focusin', onFocusIn)
    preference.addEventListener('change', onPreferenceChange)
    closeButtonRef.current?.focus({ preventScroll: true })

    return () => {
      enter.kill()
      exit?.kill()
      ghost?.remove()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', settleTransition)
      document.removeEventListener('focusin', onFocusIn)
      preference.removeEventListener('change', onPreferenceChange)
      document.body.style.overflow = previous.overflow
      document.body.style.paddingRight = previous.paddingRight
      if (appRoot) appRoot.inert = previous.inert
      if (sourceLayer) sourceLayer.style.visibility = previous.sourceVisibility
      if (opener?.isConnected) opener.focus({ preventScroll: true })
      requestCloseRef.current = () => {}
    }
  }, { scope: overlayRef })

  return createPortal(
    <div
      className="project-modal"
      ref={overlayRef}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestCloseRef.current()
      }}
    >
      <div className="project-modal__backdrop" aria-hidden="true" onMouseDown={() => requestCloseRef.current()} />
      <article
        className="project-modal__dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.id}`}
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          className="project-modal__close"
          type="button"
          onClick={() => requestCloseRef.current()}
          aria-label="Close project details"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="project-modal__media">
          <img
            ref={imageRef}
            src={project.image}
            alt={project.title}
            width={sourceImage?.naturalWidth || undefined}
            height={sourceImage?.naturalHeight || undefined}
          />
        </div>
        <div className="project-modal__content">
          <span className="project-card__category">{project.category}</span>
          <h3 id={`project-modal-title-${project.id}`} className="project-modal__title">
            <span className="text-gradient">{project.title}</span>
          </h3>
          <p className="project-modal__desc">{project.description}</p>
          {project.features && (
            <div className="project-modal__detail">
              <span className="project-modal__label">Core Features</span>
              <p>{project.features}</p>
            </div>
          )}
          {project.results && (
            <div className="project-modal__detail project-modal__detail--result">
              <span className="project-modal__label">Results</span>
              <p>{project.results}</p>
            </div>
          )}
          <span className="project-modal__label project-modal__tech-label">Tech Stack</span>
          <ul className="project-card__tags">
            {project.tags.map(tag => <li key={tag}>{tag}</li>)}
          </ul>
        </div>
      </article>
    </div>,
    document.body,
  )
}
