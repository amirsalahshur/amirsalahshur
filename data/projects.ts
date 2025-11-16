import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
    longDescription:
      "Built a comprehensive e-commerce platform from scratch using the MERN stack. Features include user authentication, product catalog, shopping cart, checkout with Stripe integration, order tracking, and a full-featured admin panel for inventory and order management.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Stripe",
      "Tailwind CSS",
      "Redux",
    ],
    category: ["Web Development", "Full Stack"],
    featured: true,
    startDate: "2023-06",
    endDate: "2023-09",
    status: "completed",
    demoUrl: "https://demo-ecommerce.example.com",
    githubUrl: "https://github.com/amirsalahshur/ecommerce-platform",
    highlights: [
      "Processed over 1000+ transactions",
      "99.9% uptime",
      "Mobile-responsive design",
      "SEO optimized",
    ],
  },
  {
    id: "project-2",
    title: "Task Management App",
    description:
      "A modern task management application with real-time collaboration features.",
    longDescription:
      "Developed a collaborative task management tool with real-time updates using WebSockets. Features include task boards, drag-and-drop interface, team collaboration, due dates, priorities, and notifications.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Socket.io",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
    ],
    category: ["Web Development", "Productivity"],
    featured: true,
    startDate: "2023-03",
    endDate: "2023-05",
    status: "completed",
    demoUrl: "https://task-app.example.com",
    githubUrl: "https://github.com/amirsalahshur/task-manager",
    highlights: [
      "Real-time collaboration for 100+ concurrent users",
      "Drag-and-drop interface",
      "Email notifications",
      "Mobile app with React Native",
    ],
  },
  {
    id: "project-3",
    title: "Weather Dashboard",
    description:
      "A beautiful weather application with forecasts, maps, and location-based alerts.",
    longDescription:
      "Created an intuitive weather dashboard that displays current conditions, 7-day forecasts, weather maps, and severe weather alerts. Integrated with multiple weather APIs for accurate data.",
    technologies: [
      "React",
      "TypeScript",
      "Weather API",
      "Chart.js",
      "Tailwind CSS",
    ],
    category: ["Web Development", "Data Visualization"],
    featured: false,
    startDate: "2023-01",
    endDate: "2023-02",
    status: "completed",
    demoUrl: "https://weather-dashboard.example.com",
    githubUrl: "https://github.com/amirsalahshur/weather-dashboard",
    highlights: [
      "5000+ daily active users",
      "Supports 100+ cities worldwide",
      "Offline mode with cached data",
    ],
  },
  {
    id: "project-4",
    title: "Portfolio Website Builder",
    description:
      "A no-code platform for creating professional portfolio websites.",
    longDescription:
      "Built a SaaS platform that allows users to create and customize their portfolio websites without coding. Features drag-and-drop editor, templates, custom domains, and analytics.",
    technologies: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "AWS S3",
      "Stripe",
      "Tailwind CSS",
    ],
    category: ["Web Development", "SaaS"],
    featured: true,
    startDate: "2022-10",
    status: "in-progress",
    githubUrl: "https://github.com/amirsalahshur/portfolio-builder",
    highlights: [
      "200+ active users",
      "50+ templates available",
      "Custom domain support",
      "SEO tools included",
    ],
  },
  {
    id: "project-5",
    title: "Crypto Price Tracker",
    description:
      "Real-time cryptocurrency price tracking with portfolio management.",
    longDescription:
      "Developed a comprehensive crypto tracking application with real-time price updates, portfolio tracking, price alerts, and market analysis tools.",
    technologies: [
      "React",
      "TypeScript",
      "CoinGecko API",
      "Chart.js",
      "Firebase",
      "Tailwind CSS",
    ],
    category: ["Web Development", "Cryptocurrency"],
    featured: false,
    startDate: "2022-08",
    endDate: "2022-09",
    status: "completed",
    demoUrl: "https://crypto-tracker.example.com",
    githubUrl: "https://github.com/amirsalahshur/crypto-tracker",
    highlights: [
      "Tracks 1000+ cryptocurrencies",
      "Real-time WebSocket updates",
      "Portfolio performance analytics",
      "Price alerts via email",
    ],
  },
  {
    id: "project-6",
    title: "Social Media Analytics",
    description:
      "Analytics dashboard for social media performance tracking.",
    longDescription:
      "Created a comprehensive analytics platform for tracking social media metrics across multiple platforms. Features include engagement tracking, follower growth, content performance, and automated reports.",
    technologies: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Social Media APIs",
      "Chart.js",
      "Tailwind CSS",
    ],
    category: ["Web Development", "Analytics"],
    featured: false,
    startDate: "2022-05",
    endDate: "2022-07",
    status: "completed",
    githubUrl: "https://github.com/amirsalahshur/social-analytics",
    highlights: [
      "Multi-platform support",
      "Automated weekly reports",
      "Competitor analysis",
      "Custom metrics",
    ],
  },
];

export const projectCategories = [
  "All",
  "Web Development",
  "Full Stack",
  "Productivity",
  "Data Visualization",
  "SaaS",
  "Cryptocurrency",
  "Analytics",
] as const;
