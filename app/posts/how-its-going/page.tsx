"use client";

import Link from "next/link";
import LanguageToggle from "../../components/language-toggle";
import { useLanguage } from "../../providers";

const COPY = {
  en: {
    back: "Back to home",
    title: "How it's going?",
    meta: "May 2, 2025 - 4 min read",
    paragraphs: [
      "I didn’t start by chasing titles — I started by shipping. Small UI tweaks taught me that details change outcomes: trust, retention, and conversion.",
      "Most of my work lives in the messy middle: SaaS dashboards, auth flows, multi-tenant data, and Shopify themes that have to load fast and convert. I like systems that don’t break at 2am.",
      "Right now I’m doubling down on fundamentals: TypeScript/Next.js for product work, Postgres/RLS for data, and Go for tooling. The goal is simple — ship useful software, learn aggressively, and keep raising the bar."
    ],
    nextTitle: "What's next",
    nextBody:
      "Next I’m tightening the project list and publishing short build notes — what I shipped, what broke, and what I’m improving."
  },
  pt: {
    back: "Voltar para início",
    title: "Como está indo?",
    meta: "2 de maio de 2025 - 4 min de leitura",
    paragraphs: [
      "Eu não comecei correndo atrás de título — comecei entregando. Pequenos ajustes de UI me ensinaram que detalhe muda resultado: confiança, retenção e conversão.",
      "A maior parte do meu trabalho vive no ‘meio bagunçado’: dashboards de SaaS, fluxos de autenticação, dados multi-tenant e temas Shopify que precisam carregar rápido e converter. Eu gosto de sistemas que não quebram às 2 da manhã.",
      "Agora estou reforçando o básico: TypeScript/Next.js no produto, Postgres/RLS nos dados e Go para tooling. O objetivo é simples — entregar software útil, aprender rápido e aumentar meu padrão." 
    ],
    nextTitle: "O que vem a seguir",
    nextBody:
      "A seguir, vou enxugar a lista de projetos e publicar notas curtas de construção — o que eu entreguei, o que quebrou e o que estou melhorando."
  }
} as const;

export default function HowItsGoingPage() {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <main className="mx-auto min-h-screen max-w-[800px] px-4 pt-10 pb-48 md:pb-10 max-md:max-w-[375px] max-sm:max-w-[320px]">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">{t.meta}</p>
        </div>

        <div className="flex flex-col gap-5 leading-relaxed text-gray-600 dark:text-gray-400">
          {t.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xs dark:bg-dark-900 dark:ring-1 dark:ring-dark-800">
          <h2 className="font-pixel text-2xl">{t.nextTitle}</h2>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
            {t.nextBody}
          </p>
        </div>
      </div>
    </main>
  );
}
