import { useState } from 'react'
import { profile } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export default function Contact() {
  const ref = useReveal()
  const [status, setStatus] = useState('idle')
  const [emailError, setEmailError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') || '').trim()

    if (!EMAIL_PATTERN.test(email)) {
      setEmailError('Please enter a valid email address.')
      form.elements.email.focus()
      return
    }

    setEmailError('')

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    if (formData.get('_honey')) return

    setStatus('sending')

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${profile.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: String(formData.get('name') || '').trim(),
            email,
            message: String(formData.get('message') || '').trim(),
            _subject: 'New portfolio inquiry',
            _template: 'table',
          }),
        },
      )

      const result = await response.json()
      if (
        !response.ok ||
        result.success === false ||
        result.success === 'false'
      ) {
        throw new Error('Message delivery failed')
      }

      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container contact__inner reveal" ref={ref}>
        <div className="contact__main">
          <div className="contact__intro">
            <span className="contact__kicker">05 — GET IN TOUCH</span>
            <h2 className="contact__title">
              Got an idea?
              <br />
              <a href={`mailto:${profile.email}`} className="contact__title-link">
                Let's talk<span className="contact__arrow">→</span>
              </a>
            </h2>
            <p className="contact__note">
              Technical exchange · project collaboration ·{' '}
              <span className="contact__note-phrase">open-source co-creation</span>
              {' '}— always happy to hear from you.
            </p>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <p className="contact-form__greeting">hello</p>
            <div className="contact-form__fields">
              <div className="contact-form__field">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  aria-label="Name"
                  autoComplete="name"
                  maxLength="80"
                  required
                />
              </div>
              <div className="contact-form__field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  aria-invalid={emailError ? 'true' : 'false'}
                  aria-describedby={emailError ? 'contact-email-error' : undefined}
                  autoComplete="email"
                  maxLength="160"
                  onChange={() => emailError && setEmailError('')}
                  onBlur={(event) => {
                    const value = event.currentTarget.value.trim()
                    if (value && !EMAIL_PATTERN.test(value)) {
                      setEmailError('Please enter a valid email address.')
                    }
                  }}
                  required
                />
                {emailError && (
                  <p
                    id="contact-email-error"
                    className="contact-form__field-error"
                    role="alert"
                  >
                    {emailError}
                  </p>
                )}
              </div>
              <div className="contact-form__field">
                <textarea
                  name="message"
                  placeholder="Message"
                  aria-label="Message"
                  rows="6"
                  maxLength="2000"
                  required
                />
              </div>
              <input
                className="contact-form__honey"
                type="text"
                name="_honey"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

            <div className="contact-form__footer">
              <button
                type="submit"
                className="contact-form__submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Submitting…' : 'Submit'}
              </button>
              <p
                className={`contact-form__status contact-form__status--${status}`}
                aria-live="polite"
              >
                {status === 'success' && 'Message sent successfully.'}
                {status === 'error' &&
                  'Unable to send. Please try again or email me directly.'}
              </p>
            </div>
          </form>
        </div>

        <div className="contact__channels">
          <a href={`mailto:${profile.email}`} className="contact__channel">
            <span className="contact__channel-label contact__channel-label--strong">
              <img
                className="contact__channel-icon"
                src="/icons/qqmail.png"
                alt=""
                width="24"
                height="24"
              />
              EMAIL
            </span>
            <span className="contact__channel-value">{profile.email}</span>
          </a>
          <a
            href={profile.github}
            className="contact__channel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact__channel-label contact__channel-label--strong">
              <img className="contact__channel-icon" src="/icons/github.svg" alt="" width="24" height="24" />
              GITHUB
            </span>
            <span className="contact__channel-value">github.com/jaqenhu</span>
          </a>
          <a
            href={profile.linkedin}
            className="contact__channel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact__channel-label contact__channel-label--strong">
              <img className="contact__channel-icon" src="/icons/linkedin.svg" alt="" width="24" height="24" />
              LINKEDIN
            </span>
            <span className="contact__channel-value">linkedin.com/in/jaqen-hu</span>
          </a>
          <a
            href={`tel:${profile.phone.replaceAll('-', '')}`}
            className="contact__channel contact__channel--phone"
          >
            <span className="contact__channel-label contact__channel-label--saul">
              Better call Jaqen
            </span>
            <span className="contact__channel-value">{profile.phone}</span>
          </a>
        </div>
      </div>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© 2026 {profile.name}</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </section>
  )
}
