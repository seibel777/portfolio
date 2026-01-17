"use client";

import Link from "next/link";
import LanguageToggle from "../components/language-toggle";
import { useLanguage } from "../providers";

const PROJECTS = [
  {
    title: "Psicofly",
    summary: {
      en: "SaaS for psychologists with multi-tenant dashboards and automations. React/Next.js + Supabase. 100% mine.",
      pt: "SaaS para psicologos com multi-tenant, dashboards e automacoes. React/Next.js + Supabase. 100% meu."
    },
    tags: ["SaaS", "Next.js", "Supabase"],
    href: "https://psicofly.com.br"
  },
  {
    title: "Tien.app",
    summary: {
      en: "Local and 100% passive security testing for repo scanning and URL analysis. Built in Go.",
      pt: "Ferramenta local e 100% passiva para varredura de repositorios e analise de URLs. Feita em Go."
    },
    tags: ["Security", "Go", "CLI"],
    href: "https://tienapp.com"
  },
  {
    title: "Nextfy",
    summary: {
      en: "Web2App for e-commerces with push notifications. React + Supabase. My software company.",
      pt: "Web2App para e-commerces com push notifications. React + Supabase. Minha empresa de software."
    },
    tags: ["Web2App", "React", "Supabase"],
    href: "https://nextfy.co"
  },
  {
    title: "Raioweb",
    summary: {
      en: "Agency for digital solutions: websites, paid traffic, design, automation. My agency.",
      pt: "Agencia de solucoes digitais: sites, trafego pago, design e automacao. Minha agencia."
    },
    tags: ["Agency", "Websites", "Automation"],
    href: "https://raioweb.com.br"
  },
  {
    title: "Anidec",
    summary: {
      en: "Anime collectibles e-commerce brand. Custom Shopify theme built by me.",
      pt: "Marca de colecionaveis de anime. Tema Shopify autoral."
    },
    tags: ["E-commerce", "Shopify", "Brand"],
    href: "https://anidec.com.br"
  }
] as const;

const COPY = {
  en: {
    back: "Back to home",
    title: "Projects",
    intro: "A snapshot of products and companies I build and run.",
    viewProject: "View Project"
  },
  pt: {
    back: "Voltar para inicio",
    title: "Projetos",
    intro: "Um recorte dos produtos e empresas que construo e lidero.",
    viewProject: "Ver projeto"
  }
} as const;

export default function ProjectsPage() {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <main className="mx-auto min-h-screen max-w-[1200px] px-4 pt-10 pb-48 md:pb-10 max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 transition hover:text-blue-700 dark:text-gray-400"
            >
              {t.back}
            </Link>
            <LanguageToggle />
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl">{t.title}</h1>
          <p className="max-w-prose leading-relaxed text-gray-600 dark:text-gray-400">
            {t.intro}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              summary={project.summary[language]}
              tags={project.tags}
              href={project.href}
              cta={t.viewProject}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function ProjectCard({
  title,
  summary,
  tags,
  href,
  cta
}: {
  title: string;
  summary: string;
  tags: readonly string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="h-full w-full rounded-3xl shadow-xs transition-shadow duration-300 hover:shadow-lg">
      <div className="flex h-full flex-col gap-6 rounded-3xl bg-white p-6 dark:bg-dark-900 dark:ring-1 dark:ring-dark-800">
        <div className="flex flex-col gap-3">
          <h2 className="font-pixel text-2xl">{title}</h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            {summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-dark-800 dark:text-dark-50"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-3 self-start whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm text-black ring-2 ring-gray-200/45 transition-all duration-300 hover:ring-4 focus:outline-none focus:ring-4 dark:text-black dark:ring-gray-200/30"
          target="_blank"
          rel="noreferrer"
        >
          {cta}
          <ArrowIcon className="h-4 w-4 text-black" />
        </Link>
      </div>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 448 512"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
    </svg>
  );
}
