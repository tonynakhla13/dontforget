export type FounderTeamCard = {
  type: "founder";
  num: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  location: string;
  tags: string[];
  stats: { value: string; label: string }[];
};

export type OpenTeamCard = {
  type: "open";
  num: string;
  role: string;
  note: string;
  tags: string[];
};

export type TeamCardData = FounderTeamCard | OpenTeamCard;

export const TEAM_CARDS: TeamCardData[] = [
  {
    type: "founder",
    num: "01",
    name: "Tony Nakhla",
    role: "Founder / Lead Developer",
    bio: "Builds the systems, sets the bar, and makes sure nothing ships unless it's genuinely good.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    location: "Remote / GMT+2",
    tags: ["Next.js", "React", "Node.js", "Systems", "Mobile"],
    stats: [
      { value: "14+", label: "projects shipped" },
      { value: "3yr", label: "building" },
    ],
  },
  {
    type: "open",
    num: "02",
    role: "Senior UI/UX Designer",
    note: "We're looking for someone obsessive about craft, detail, and the 1px decisions nobody else notices.",
    tags: ["Figma", "Motion Design", "Brand Systems"],
  },
  {
    type: "open",
    num: "03",
    role: "Mobile Developer",
    note: "iOS + Android, React Native. You care about feel, not just functionality.",
    tags: ["iOS", "Android", "React Native"],
  },
  {
    type: "open",
    num: "04",
    role: "SEO & Growth Strategist",
    note: "Data-driven, creative enough to see what the data misses. AI-search fluency a plus.",
    tags: ["SEO", "AI Search", "Analytics"],
  },
];
