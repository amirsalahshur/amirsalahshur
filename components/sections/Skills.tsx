'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { skills, skillCategories } from '@/data/skills';
import { useState } from 'react';

export function SkillsSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('language');

  const filteredSkills = skills.filter(
    (skill) => skill.category === selectedCategory
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-green-500';
      case 'advanced':
        return 'bg-blue-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'beginner':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelWidth = (level: string) => {
    switch (level) {
      case 'expert':
        return 'w-full';
      case 'advanced':
        return 'w-4/5';
      case 'intermediate':
        return 'w-3/5';
      case 'beginner':
        return 'w-2/5';
      default:
        return 'w-1/2';
    }
  };

  return (
    <section id="skills" className="section">
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
              Skills & <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Technologies and tools I work with
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {skillCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-6 py-2.5 rounded-full font-medium transition-all',
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {filteredSkills.map((skill, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-background border border-border hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {skill.level}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-1000',
                      getLevelColor(skill.level),
                      inView ? getLevelWidth(skill.level) : 'w-0'
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Cloud */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-6">Tech Stack Overview</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {skills.slice(0, 15).map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all cursor-default"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
