'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FiMail,
  FiSend,
  FiMapPin,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate form submission
      // In production, you would send this to an API endpoint or email service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Form data:', data);

      // Create mailto link as fallback
      const subject = data.subject || 'Contact from Portfolio';
      const body = `Name: ${data.name}%0D%0AEmail: ${data.email}%0D%0A%0D%0AMessage:%0D%0A${data.message}`;
      window.location.href = `mailto:${siteConfig.author.email}?subject=${encodeURIComponent(subject)}&body=${body}`;

      setSubmitStatus('success');
      reset();

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section bg-muted/30">
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
              Get in <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Have a project in mind? Let's work together!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
                <p className="text-foreground/80 leading-relaxed mb-8">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your visions. Feel free to reach
                  out through the form or directly via email.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border hover:border-primary transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <div className="text-sm text-muted-foreground">
                      {siteConfig.author.email}
                    </div>
                  </div>
                </a>

                <a
                  href={siteConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border hover:border-primary transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FiGlobe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Website</div>
                    <div className="text-sm text-muted-foreground">
                      {siteConfig.url}
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Location</div>
                    <div className="text-sm text-muted-foreground">
                      Remote / Available Worldwide
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-4">Follow Me</h4>
                <div className="flex flex-wrap gap-3">
                  {siteConfig.social.slice(0, 5).map((social) => {
                    const Icon = social.icon as any;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        aria-label={social.name}
                      >
                        <Icon size={16} />
                        <span className="text-sm font-medium">{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 rounded-lg bg-background border border-border">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                suppressHydrationWarning
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border bg-background',
                      'focus:outline-none focus:ring-2 focus:ring-primary',
                      errors.name ? 'border-red-500' : 'border-border'
                    )}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border bg-background',
                      'focus:outline-none focus:ring-2 focus:ring-primary',
                      errors.email ? 'border-red-500' : 'border-border'
                    )}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register('subject')}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border bg-background',
                      'focus:outline-none focus:ring-2 focus:ring-primary',
                      errors.subject ? 'border-red-500' : 'border-border'
                    )}
                    placeholder="Project inquiry"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message')}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border bg-background',
                      'focus:outline-none focus:ring-2 focus:ring-primary',
                      'resize-vertical',
                      errors.message ? 'border-red-500' : 'border-border'
                    )}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary py-3 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20">
                    <FiCheckCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">
                      Message sent successfully! I'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20">
                    <FiAlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">
                      Something went wrong. Please try again or email me directly.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
