import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "Software Developer",
    company: "Freelance",
    location: "Remote",
    startDate: "2023-01",
    current: true,
    type: "freelance",
    description:
      "Working on various web development projects, specializing in modern JavaScript frameworks and full-stack solutions.",
    responsibilities: [
      "Developing responsive web applications using React and Next.js",
      "Building RESTful APIs with Node.js and Express",
      "Implementing modern UI/UX designs with Tailwind CSS",
      "Managing databases with MongoDB and PostgreSQL",
      "Collaborating with clients to deliver high-quality solutions",
    ],
    achievements: [
      "Successfully delivered 15+ projects with 100% client satisfaction",
      "Reduced application load times by 40% through optimization",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Tailwind CSS",
      "Docker",
      "Git",
    ],
  },
  {
    id: "exp-2",
    title: "Junior Web Developer",
    company: "Tech Solutions",
    location: "Remote",
    startDate: "2022-06",
    endDate: "2022-12",
    type: "work",
    description:
      "Contributed to the development of enterprise web applications and internal tools.",
    responsibilities: [
      "Assisted in developing new features for web applications",
      "Fixed bugs and improved application performance",
      "Wrote unit tests and participated in code reviews",
      "Collaborated with senior developers on complex features",
    ],
    achievements: [
      "Reduced bug count by 30% through comprehensive testing",
      "Improved code quality scores by implementing best practices",
    ],
    technologies: ["React", "JavaScript", "CSS", "Node.js", "Git"],
  },
  {
    id: "exp-3",
    title: "Web Development Intern",
    company: "StartUp Inc",
    location: "Remote",
    startDate: "2022-01",
    endDate: "2022-05",
    type: "internship",
    description:
      "Learned modern web development practices and contributed to real-world projects.",
    responsibilities: [
      "Built responsive UI components using React",
      "Assisted in API integration and testing",
      "Participated in daily standups and sprint planning",
      "Documented code and maintained project wikis",
    ],
    achievements: [
      "Successfully completed 3 major feature implementations",
      "Received outstanding performance review",
    ],
    technologies: ["React", "HTML", "CSS", "JavaScript", "REST APIs"],
  },
];
