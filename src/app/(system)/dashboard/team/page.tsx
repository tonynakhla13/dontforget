import { prisma } from "@/lib/prisma";
import TeamManager from "@/components/dashboard/TeamManager";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Team</h1>
      <TeamManager initial={members} />
    </div>
  );
}
