'use client';

import { siteConfig } from '@/lib/config';
import { FiDownload, FiMail, FiArrowDown } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div
          className={cn(
            'max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000',
            inView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          )}
        >
          {/* Greeting */}
          <div className="space-y-2">
            <p className="text-lg md:text-xl text-muted-foreground">
              👋 Hello, I'm
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              <span className="gradient-text">{siteConfig.author.name}</span>
            </h1>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
              Software Developer & Problem Solver
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {siteConfig.author.bio}
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="px-4 py-2 rounded-full bg-muted border border-border">
              🔭 Active in IT & Crypto Space
            </div>
            <div className="px-4 py-2 rounded-full bg-muted border border-border">
              🌱 Fast Learner
            </div>
            <div className="px-4 py-2 rounded-full bg-muted border border-border">
              💡 Problem Solver
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#contact"
              className="btn btn-primary px-8 py-3 text-base gap-2 group"
            >
              <FiMail className="group-hover:rotate-12 transition-transform" />
              Get in Touch
            </a>
            <a
              href="/resume.pdf"
              download
              className="btn btn-outline px-8 py-3 text-base gap-2 group"
            >
              <FiDownload className="group-hover:translate-y-0.5 transition-transform" />
              Download Resume
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 pt-8">
            {siteConfig.social.slice(0, 5).map((social) => {
              const Icon = social.icon as any;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all"
                  aria-label={social.name}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          {/* Scroll indicator */}
          <div className="pt-12 animate-bounce">
            <a
              href="#about"
              className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Scroll to about section"
            >
              <span className="text-sm">Scroll to explore</span>
              <FiArrowDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
