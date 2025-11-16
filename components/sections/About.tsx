'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

export function AboutSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const highlights = [
    {
      emoji: '💻',
      title: 'Clean Code',
      description: 'I write clean, maintainable code following industry best practices',
    },
    {
      emoji: '🚀',
      title: 'Fast Learner',
      description: 'Quick to adapt and learn new technologies and frameworks',
    },
    {
      emoji: '🎯',
      title: 'Problem Solver',
      description: 'Turning complex problems into simple, elegant solutions',
    },
    {
      emoji: '🤝',
      title: 'Team Player',
      description: 'Great at collaboration and communication with team members',
    },
  ];

  return (
    <section id="about" className="section bg-muted/30">
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
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Get to know more about who I am and what I do
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Bio */}
            <div className="space-y-6">
              <div className="space-y-4 text-foreground/90 leading-relaxed">
                <p>
                  👋 Hi! I'm <strong>{siteConfig.author.name}</strong>, a passionate
                  software developer with a focus on creating innovative and
                  efficient solutions.
                </p>
                <p>
                  I specialize in modern web development using cutting-edge technologies
                  like React, Next.js, and TypeScript. My journey in programming started
                  with a curiosity to understand how things work, and it has evolved into
                  a passion for building impactful applications.
                </p>
                <p>
                  I'm currently active in both the IT field and crypto space, constantly
                  learning and exploring new technologies. As a junior programmer with
                  fast learning abilities, I thrive on challenges and am always looking
                  for opportunities to grow.
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  "Code is poetry written in logic"
                </blockquote>
              </div>
            </div>

            {/* Right: Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-6 rounded-lg bg-background border border-border',
                    'hover:border-primary hover:shadow-lg transition-all duration-300',
                    'hover:-translate-y-1'
                  )}
                >
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Facts */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Years Experience', value: '2+' },
              { label: 'Projects Completed', value: '15+' },
              { label: 'Technologies', value: '20+' },
              { label: 'Happy Clients', value: '10+' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-background border border-border"
              >
                <div className="text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
