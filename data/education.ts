import { Education } from "@/types";

export const education: Education[] = [
  {
    id: "edu-1",
    degree: "Bachelor of Science",
    field: "Computer Science",
    institution: "University of Technology",
    location: "Tehran, Iran",
    startDate: "2020-09",
    endDate: "2024-06",
    gpa: "3.8/4.0",
    achievements: [
      "Dean's List for 6 consecutive semesters",
      "Best Final Year Project Award",
      "President of Computer Science Student Association",
      "Published research paper on Web Performance Optimization",
    ],
    description:
      "Focused on software engineering, web development, and computer science fundamentals. Participated in various hackathons and coding competitions.",
  },
  {
    id: "edu-2",
    degree: "High School Diploma",
    field: "Mathematics and Physics",
    institution: "Science High School",
    location: "Tehran, Iran",
    startDate: "2016-09",
    endDate: "2020-06",
    achievements: [
      "Graduated with honors",
      "Mathematics Olympiad Silver Medal",
      "Science Fair First Place",
    ],
    description:
      "Specialized in advanced mathematics and physics with a strong foundation in problem-solving and analytical thinking.",
  },
];

export const certifications = [
  {
    id: "cert-1",
    name: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta (via Coursera)",
    date: "2023-08",
    credentialUrl: "https://coursera.org/verify/professional-cert/example",
  },
  {
    id: "cert-2",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2023-05",
    credentialUrl: "https://aws.amazon.com/verification",
  },
  {
    id: "cert-3",
    name: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "2022-12",
    credentialUrl: "https://freecodecamp.org/certification/example",
  },
  {
    id: "cert-4",
    name: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "2022-10",
    credentialUrl: "https://freecodecamp.org/certification/example",
  },
];
