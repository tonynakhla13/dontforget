import HomeImmersive from "@/components/home/HomeImmersive";
import type { Project } from "@/components/Work";
import type { PublicService } from "@/lib/public-content";

export default function ImmersivePage({ projects, services }: { projects?: Project[]; services?: PublicService[] }) {
  return <HomeImmersive projects={projects} services={services} />;
}
