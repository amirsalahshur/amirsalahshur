'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { testimonials } from '@/data/testimonials';
import { FiStar, FiLinkedin } from 'react-icons/fi';

export function TestimonialsSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div
          ref={ref}
          className={cn(
            'transition-all duration-1000',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Client <span className="gradient-text">Testimonials</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              What people say about working with me
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-6 rounded-lg bg-background border border-border hover:border-primary transition-all card-hover"
              >
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <FiStar
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                <blockquote className="text-foreground/90 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-start justify-between pt-4 border-t border-border">
                  <div className="flex-1">
                    <div className="font-bold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-primary">{testimonial.role}</div>
                    {testimonial.company && (
                      <div className="text-sm text-muted-foreground">
                        {testimonial.company}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(testimonial.date)}
                    </div>
                  </div>

                  {testimonial.linkedinUrl && (
                    <a
                      href={testimonial.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-8 h-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                      aria-label="View on LinkedIn"
                    >
                      <FiLinkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Want to work together? Let's create something amazing!
            </p>
            <a href="#contact" className="btn btn-primary px-8 py-3">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
