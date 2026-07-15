import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ProjectsClient from "./projects-client";
import type { Project } from "./projects-client";

export default function ProjectsPage() {
  const filePath = path.join(process.cwd(), "projects.md");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  const mapProjects = (items: any[]): Project[] => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item: any) => ({
      title: item.title || "",
      status: item.status || "development",
      href: item.href || undefined,
      tags: Array.isArray(item.tags) ? item.tags : [],
      summary: {
        en: item.summary_en || "",
        pt: item.summary_pt || ""
      }
    }));
  };

  const activeProjects = mapProjects(data.active_projects);
  const flyProjects = mapProjects(data.fly_projects);
  const futureProjects = mapProjects(data.future_projects);

  return (
    <ProjectsClient
      activeProjects={activeProjects}
      flyProjects={flyProjects}
      futureProjects={futureProjects}
    />
  );
}
