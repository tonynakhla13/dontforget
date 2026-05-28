import HomeImmersive from "@/components/home/HomeImmersive";
import type { Project } from "@/components/Work";

export default function ImmersivePage({ projects }: { projects?: Project[] }) {
  return <HomeImmersive projects={projects} />;
}
