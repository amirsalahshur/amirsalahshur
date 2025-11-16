import { Skill } from "@/types";

export const skills: Skill[] = [
  // Languages
  {
    name: "JavaScript",
    level: "advanced",
    category: "language",
    icon: "SiJavascript",
  },
  {
    name: "TypeScript",
    level: "advanced",
    category: "language",
    icon: "SiTypescript",
  },
  {
    name: "Python",
    level: "intermediate",
    category: "language",
    icon: "SiPython",
  },
  {
    name: "HTML5",
    level: "expert",
    category: "language",
    icon: "SiHtml5",
  },
  {
    name: "CSS3",
    level: "expert",
    category: "language",
    icon: "SiCss3",
  },
  {
    name: "SQL",
    level: "intermediate",
    category: "language",
    icon: "SiMysql",
  },

  // Frameworks & Libraries
  {
    name: "React",
    level: "advanced",
    category: "framework",
    icon: "SiReact",
  },
  {
    name: "Next.js",
    level: "advanced",
    category: "framework",
    icon: "SiNextdotjs",
  },
  {
    name: "Node.js",
    level: "intermediate",
    category: "framework",
    icon: "SiNodedotjs",
  },
  {
    name: "Express.js",
    level: "intermediate",
    category: "framework",
    icon: "SiExpress",
  },
  {
    name: "Tailwind CSS",
    level: "advanced",
    category: "framework",
    icon: "SiTailwindcss",
  },
  {
    name: "Framer Motion",
    level: "intermediate",
    category: "framework",
    icon: "SiFramer",
  },

  // Databases
  {
    name: "MongoDB",
    level: "intermediate",
    category: "database",
    icon: "SiMongodb",
  },
  {
    name: "PostgreSQL",
    level: "intermediate",
    category: "database",
    icon: "SiPostgresql",
  },
  {
    name: "Redis",
    level: "beginner",
    category: "database",
    icon: "SiRedis",
  },

  // Tools & Technologies
  {
    name: "Git",
    level: "advanced",
    category: "tool",
    icon: "SiGit",
  },
  {
    name: "Docker",
    level: "intermediate",
    category: "tool",
    icon: "SiDocker",
  },
  {
    name: "VS Code",
    level: "expert",
    category: "tool",
    icon: "SiVisualstudiocode",
  },
  {
    name: "Webpack",
    level: "intermediate",
    category: "tool",
    icon: "SiWebpack",
  },
  {
    name: "Jest",
    level: "intermediate",
    category: "tool",
    icon: "SiJest",
  },
  {
    name: "Postman",
    level: "advanced",
    category: "tool",
    icon: "SiPostman",
  },
  {
    name: "Figma",
    level: "intermediate",
    category: "tool",
    icon: "SiFigma",
  },
  {
    name: "Linux",
    level: "intermediate",
    category: "tool",
    icon: "SiLinux",
  },
  {
    name: "Vercel",
    level: "advanced",
    category: "tool",
    icon: "SiVercel",
  },
  {
    name: "GitHub Actions",
    level: "intermediate",
    category: "tool",
    icon: "SiGithubactions",
  },
];

export const skillCategories = [
  { id: "language", name: "Languages" },
  { id: "framework", name: "Frameworks & Libraries" },
  { id: "database", name: "Databases" },
  { id: "tool", name: "Tools & Technologies" },
] as const;
