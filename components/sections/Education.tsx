'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { education, certifications } from '@/data/education';
import { FiAward, FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';

export function EducationSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <section id="education" className="section bg-muted/30">
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
              Education & <span className="gradient-text">Certifications</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              My academic background and professional certifications
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Education */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiAward className="text-primary" />
                Education
              </h3>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-6 rounded-lg bg-background border border-border hover:border-primary transition-all card-hover"
                  >
                    <div className="mb-3">
                      <h4 className="text-xl font-bold text-foreground mb-1">
                        {edu.degree}
                      </h4>
                      <p className="text-primary font-medium mb-2">{edu.field}</p>
                      {edu.institutionUrl ? (
                        <a
                          href={edu.institutionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          {edu.institution}
                          <FiExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{edu.institution}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(edu.startDate)} -{' '}
                        {edu.current ? 'Present' : formatDate(edu.endDate!)}
                      </span>
                      {edu.gpa && (
                        <span className="font-medium text-primary">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-sm text-foreground/80 mb-4">
                        {edu.description}
                      </p>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-sm mb-2">
                          Achievements:
                        </h5>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {edu.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-1">✓</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiAward className="text-primary" />
                Certifications
              </h3>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-5 rounded-lg bg-background border border-border hover:border-primary transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1">
                          {cert.name}
                        </h4>
                        <p className="text-sm text-primary mb-2">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground">
                          Issued: {formatDate(cert.date)}
                        </p>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                          aria-label="View credential"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add More CTA */}
                <div className="p-5 rounded-lg border border-dashed border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Always learning and growing
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary text-sm font-medium">
                    <FiAward className="w-4 h-4" />
                    More certifications coming soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
