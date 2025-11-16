import { SiteConfig } from "@/types";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaTelegram,
  FaDiscord,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";

export const siteConfig: SiteConfig = {
  name: "Amir Salahshur",
  title: "Amir Salahshur | Software Developer & Problem Solver",
  description:
    "Professional portfolio of Amir Salahshur - Software Developer, Problem Solver, and Tech Enthusiast. Specializing in modern web development with React, Next.js, TypeScript, and more.",
  url: "https://amirsalahshur.xyz",
  author: {
    name: "Amir Salahshur",
    email: "amirsalahshur2@gmail.com",
    bio: "Passionate software developer crafting innovative solutions with modern technologies. Active in both IT field and crypto space. Junior programmer with fast learning ability and a passion for solving complex problems.",
  },
  social: [
    {
      name: "GitHub",
      url: "https://github.com/amirsalahshur",
      icon: FaGithub,
      username: "@amirsalahshur",
    },
    {
      name: "Twitter",
      url: "https://x.com/salahshur_amir",
      icon: FaTwitter,
      username: "@salahshur_amir",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/amirsalahshur",
      icon: FaLinkedin,
      username: "amirsalahshur",
    },
    {
      name: "Telegram",
      url: "https://t.me/Amir_salahshurr",
      icon: FaTelegram,
      username: "@Amir_salahshurr",
    },
    {
      name: "Discord",
      url: "https://discord.gg/dUf6A4cm",
      icon: FaDiscord,
    },
    {
      name: "Email",
      url: "mailto:amirsalahshur2@gmail.com",
      icon: FaEnvelope,
    },
    {
      name: "Website",
      url: "https://amirsalahshur.xyz",
      icon: FaGlobe,
    },
  ],
  locales: [
    {
      code: "en",
      name: "English",
      direction: "ltr",
      flag: "🇺🇸",
    },
    {
      code: "fa",
      name: "فارسی",
      direction: "rtl",
      flag: "🇮🇷",
    },
  ],
  defaultLocale: "en",
};

export const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];
