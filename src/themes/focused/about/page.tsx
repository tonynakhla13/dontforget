import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getClients } from "@/lib/public-content";
import AboutFocused, { type FocusedTeamMember } from "@/components/focused/AboutFocused";

export const metadata: Metadata = {
  title: "About Us — NOX Studio",
  description:
    "Meet the team behind NOX Studio — a small, mighty creative agency building fast, memorable digital experiences driven by craft and radical honesty.",
};

export const dynamic = "force-dynamic";

const TEAM_FALLBACK: FocusedTeamMember[] = [
  { name: "Tony Nakhla",  role: "Founder & Lead Developer" },
  { name: "Sarah Chen",   role: "Creative Director" },
  { name: "Marcus Webb",  role: "UI/UX Designer" },
  { name: "Leila Hassan", role: "Brand Strategist" },
];

async function getTeam(): Promise<FocusedTeamMember[]> {
  try {
    const members = await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        name: true,
        role: true,
        photo: true,
        linkedinUrl: true,
        twitterUrl: true,
      },
    });
    return members.length ? members : TEAM_FALLBACK;
  } catch {
    return TEAM_FALLBACK;
  }
}

export default async function FocusedAboutPage() {
  const [team, clients] = await Promise.all([getTeam(), getClients()]);
  return <AboutFocused team={team} clients={clients} />;
}
