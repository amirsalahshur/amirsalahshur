'use client';

import Link from 'next/link';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Text */}
        <h1 className="text-9xl md:text-[12rem] font-bold gradient-text mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary px-8 py-3 gap-2 group">
            <FiHome className="group-hover:scale-110 transition-transform" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline px-8 py-3 gap-2 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-12">
          <div className="w-64 h-64 mx-auto opacity-10">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                fill="currentColor"
                d="M47.1,-57.1C59.9,-45.6,68.5,-28.9,71.4,-11.1C74.3,6.7,71.5,25.6,62.3,40.7C53.1,55.8,37.5,67.1,20.2,71.2C2.9,75.3,-16.1,72.2,-32.8,64.4C-49.5,56.6,-63.9,44.1,-71.1,28.2C-78.3,12.3,-78.3,-6.9,-72.3,-23.7C-66.3,-40.5,-54.3,-54.9,-39.8,-65.9C-25.3,-76.9,-8.4,-84.5,5.8,-91.3C20,-98.1,34.3,-68.6,47.1,-57.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
