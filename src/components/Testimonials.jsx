const testimonials = [
  {
    name: 'Shawn',
    perspective: 'Technical ownership',
    title: 'From ambiguity to delivery.',
    quote:
      'Jaqen turns complex AI requirements into clear technical decisions. He communicates trade-offs early and takes ownership from implementation through deployment and handoff.',
    context: 'Technical Project Lead',
  },
  {
    name: 'Ning',
    perspective: 'Practical AI',
    title: 'Built around how we work.',
    quote:
      'Jaqen understands the questions our team needs to answer. He focuses on retrieval quality and clear sources, helping us use AI with a better understanding of its limits.',
    context: 'Knowledge Management Lead',
  },
  {
    name: 'Xie',
    perspective: 'Thoughtful delivery',
    title: 'Clear, thoughtful collaboration.',
    quote:
      'Jaqen translates our training needs into practical VR experiences. He turns feedback into clear priorities and keeps us aligned on interaction details, progress, and next steps.',
    context: 'Training Program Manager',
  },
]

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        <div className="section__head testimonials__head">
          <span className="section__index">04</span>
          <h2 id="testimonials-title" className="section__title">
            <span className="text-gradient">Testimonials</span>
          </h2>
          <span className="section__en">WORKING TOGETHER</span>
        </div>

        <p className="testimonials__intro">
          From the people I’ve worked with.
        </p>

        <div className="testimonials__grid">
          {testimonials.map((testimonial) => (
            <figure className="testimonial-card" key={testimonial.name}>
              <div className="testimonial-card__top">
                <span className="testimonial-card__perspective">
                  {testimonial.perspective}
                </span>
                <svg
                  className="testimonial-card__quote-mark"
                  viewBox="0 0 32 28"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M2 14C2 7 6 3 13 2v5c-4 1-6 3-6 6h6v12H2V14Zm17 0c0-7 4-11 11-12v5c-4 1-6 3-6 6h6v12H19V14Z" />
                </svg>
              </div>

              <h3 className="testimonial-card__title">{testimonial.title}</h3>
              <blockquote className="testimonial-card__quote">
                <p>{testimonial.quote}</p>
              </blockquote>

              <figcaption className="testimonial-card__author">
                <span className="testimonial-card__avatar" aria-hidden="true">
                  {testimonial.name.charAt(0)}
                </span>
                <div className="testimonial-card__identity">
                  <span className="testimonial-card__name">{testimonial.name}</span>
                  <span className="testimonial-card__context">
                    {testimonial.context}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
