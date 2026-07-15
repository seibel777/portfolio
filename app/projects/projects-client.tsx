"use client";

import Link from "next/link";
import LanguageToggle from "../components/language-toggle";
import { useLanguage } from "../providers";

type Language = "en" | "pt";
type ProjectStatus = "live" | "development" | "future";

export type Project = {
  title: string;
  summary: Record<Language, string>;
  tags: readonly string[];
  status: ProjectStatus;
  href?: string;
};

type ProjectsClientProps = {
  activeProjects: readonly Project[];
  flyProjects: readonly Project[];
  futureProjects: readonly Project[];
};

const COPY = {
  en: {
    back: "Back to home",
    title: "Projects",
    intro: "Products and companies I build, operate, and prepare for their next stage.",
    activeTitle: "Products and companies",
    activeDescription: "Projects already operating or moving toward release.",
    flyTitle: "Fly ecosystem in development",
    flyDescription:
      "Five vertical products share Psicofly's foundation while adapting workflows, language, and professional rules to each healthcare field.",
    futureTitle: "After the Fly ecosystem",
    futureDescription: "The next product already placed on the roadmap.",
    viewProject: "View project",
    status: {
      live: "Live",
      development: "In development",
      future: "Planned"
    }
  },
  pt: {
    back: "Voltar ao início",
    title: "Projetos",
    intro: "Produtos e empresas que construo, opero e preparo para a próxima etapa.",
    activeTitle: "Produtos e empresas",
    activeDescription: "Projetos em operação ou avançando para o lançamento.",
    flyTitle: "Ecossistema Fly em desenvolvimento",
    flyDescription:
      "Cinco produtos verticais compartilham a base da Psicofly e adaptam fluxos, linguagem e regras profissionais para cada área da saúde.",
    futureTitle: "Depois do ecossistema Fly",
    futureDescription: "O próximo produto já posicionado no roadmap.",
    viewProject: "Ver projeto",
    status: {
      live: "Em operação",
      development: "Em desenvolvimento",
      future: "Planejado"
    }
  }
} as const;

export default function ProjectsClient({
  activeProjects,
  flyProjects,
  futureProjects
}: ProjectsClientProps) {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <main className="mx-auto min-h-screen max-w-[1200px] px-4 pb-32 pt-10 md:pb-16 max-lg:max-w-[800px] max-md:max-w-[680px]">
      <div className="flex flex-col gap-14">
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="rounded-full px-2 py-1 text-sm text-gray-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400"
            >
              {t.back}
            </Link>
            <LanguageToggle />
          </div>
          <h1 className="font-pixel text-4xl md:text-5xl">{t.title}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
            {t.intro}
          </p>
        </header>

        <ProjectSection
          title={t.activeTitle}
          description={t.activeDescription}
          projects={activeProjects}
          language={language}
          labels={t}
        />

        <ProjectSection
          title={t.flyTitle}
          description={t.flyDescription}
          projects={flyProjects}
          language={language}
          labels={t}
        />

        <ProjectSection
          title={t.futureTitle}
          description={t.futureDescription}
          projects={futureProjects}
          language={language}
          labels={t}
          compact
        />
      </div>
    </main>
  );
}

function ProjectSection({
  title,
  description,
  projects,
  language,
  labels,
  compact = false
}: {
  title: string;
  description: string;
  projects: readonly Project[];
  language: Language;
  labels: (typeof COPY)[Language];
  compact?: boolean;
}) {
  return (
    <section aria-labelledby={title.replaceAll(" ", "-").toLowerCase()}>
      <div className="mb-6 max-w-3xl">
        <h2
          id={title.replaceAll(" ", "-").toLowerCase()}
          className="font-pixel text-2xl md:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className={compact ? "max-w-2xl" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            language={language}
            statusLabel={labels.status[project.status]}
            cta={labels.viewProject}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  language,
  statusLabel,
  cta
}: {
  project: Project;
  language: Language;
  statusLabel: string;
  cta: string;
}) {
  return (
    <article className="h-full w-full rounded-3xl shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-full flex-col gap-6 rounded-3xl bg-white p-6 dark:bg-dark-900 dark:ring-1 dark:ring-dark-800">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-pixel text-2xl">{project.title}</h3>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
              project.status === "live"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : project.status === "future"
                  ? "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="grow leading-relaxed text-gray-600 dark:text-gray-400">
          {project.summary[language]}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-dark-800 dark:text-dark-50"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.href ? (
          <Link
            href={project.href}
            className="inline-flex min-h-11 items-center gap-3 self-start whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm text-black ring-2 ring-gray-200/45 transition-all duration-300 hover:ring-4 focus-visible:outline-none focus-visible:ring-4 dark:ring-gray-200/30"
            target="_blank"
            rel="noreferrer"
          >
            {cta}
            <ArrowIcon className="h-4 w-4 text-black" />
          </Link>
        ) : null}
      </div>
    </article>
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
