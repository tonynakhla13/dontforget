"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "./MediaPicker";

interface TechItem {
  id: string;
  name: string;
  icon?: string | null;
  iconUrl?: string | null;
}

interface ClientItem {
  id: string;
  name: string;
  company?: string | null;
  country?: string | null;
  logo?: string | null;
  website?: string | null;
}

interface MediaAssetItem {
  id: string;
  url: string;
  originalName?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  alt?: string | null;
}

interface ServiceItem {
  id: string;
  title: string;
}

interface AttachmentInput {
  mediaId: string;
  role: string;
  theme?: string | null;
  order?: number;
}

type ProjectChallenge = {
  title: string;
  problem: string;
  proposedSolutions: { title: string; description: string }[];
  chosenSolutionIndex: number | null;
  chosenReason: string;
};

type ProjectResult = {
  title: string;
  description: string;
  mediaId?: string;
  metric?: string;
};

interface ProjectData {
  id?: string;
  title?: string;
  titleAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  client?: string;
  clientAr?: string;
  clientId?: string | null;
  year?: string;
  category?: string;
  categoryAr?: string;
  tags?: string[];
  tagsAr?: string[];
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  gifUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  featured?: boolean;
  status?: "DRAFT" | "PUBLISHED";
  order?: number;
  projectType?: string;
  tagline?: string;
  shortDescription?: string;
  fullDescription?: string;
  location?: string;
  clientLogo?: string;
  techStack?: string[];
  testimonialText?: string;
  gallery?: { url: string; type: "image" | "video" | "pdf" }[];
  extraMile?: string;
  heroImage?: string;
  tallImage?: string;
  useTallImage?: boolean;
  clientGoals?: string[];
  challenges?: ProjectChallenge[];
  results?: ProjectResult[];
  testimonialAuthor?: string;
  testimonialRole?: string;
  testimonialCompany?: string;
  extraMilePlanned?: string;
  attachments?: AttachmentInput[];
  serviceIds?: string[];
}

const PROJECT_TYPES = ["website", "web_app", "mobile_app", "dashboard", "branding", "ecommerce", "other"];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanStrings(values: string[] | undefined) {
  return (values ?? []).map((item) => item.trim()).filter(Boolean);
}

function emptyChallenge(): ProjectChallenge {
  return {
    title: "",
    problem: "",
    proposedSolutions: [{ title: "", description: "" }],
    chosenSolutionIndex: null,
    chosenReason: "",
  };
}

function emptyResult(): ProjectResult {
  return { title: "", description: "", metric: "", mediaId: "" };
}

export default function ProjectForm({
  initial,
  techItems = [],
  clientItems = [],
  services = [],
  mediaAssets = [],
}: {
  initial?: ProjectData;
  techItems?: TechItem[];
  clientItems?: ClientItem[];
  services?: ServiceItem[];
  mediaAssets?: MediaAssetItem[];
}) {
  const router = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState<ProjectData>({
    title: "",
    titleAr: "",
    slug: "",
    description: "",
    descriptionAr: "",
    client: "",
    clientAr: "",
    clientId: null,
    year: new Date().getFullYear().toString(),
    category: "",
    categoryAr: "",
    tags: [],
    tagsAr: [],
    coverImage: "",
    images: [],
    videoUrl: "",
    gifUrl: "",
    liveUrl: "",
    githubUrl: "",
    caseStudyUrl: "",
    featured: false,
    status: "DRAFT",
    order: 0,
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    location: "",
    clientLogo: "",
    techStack: [],
    testimonialText: "",
    gallery: [],
    extraMile: "",
    heroImage: "",
    tallImage: "",
    useTallImage: false,
    clientGoals: [""],
    challenges: [emptyChallenge()],
    results: [emptyResult()],
    testimonialAuthor: "",
    testimonialRole: "",
    testimonialCompany: "",
    extraMilePlanned: "",
    attachments: [],
    serviceIds: [],
    ...initial,
    projectType: initial?.projectType === "web_development" ? "website" : initial?.projectType ?? "website",
  });

  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [tagsArInput, setTagsArInput] = useState((initial?.tagsAr ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "unsaved" | "saving">("idle");

  const attachments = useMemo(() => form.attachments ?? [], [form.attachments]);
  const selectedServices = form.serviceIds ?? [];
  const selectedTech = Array.isArray(form.techStack) ? form.techStack : [];
  const clientGoals = form.clientGoals?.length ? form.clientGoals : [""];
  const challenges = form.challenges?.length ? form.challenges : [emptyChallenge()];
  const results = form.results?.length ? form.results : [emptyResult()];
  const galleryOrders = useMemo(
    () =>
      attachments
        .filter((item) => item.role === "project_gallery")
        .map((item) => item.order ?? 0)
        .sort((a, b) => a - b),
    [attachments]
  );

  function set<K extends keyof ProjectData>(field: K, value: ProjectData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("unsaved");
  }

  function updateAt<T>(arr: T[], index: number, value: T): T[] {
    const next = [...arr];
    next[index] = value;
    return next;
  }

  function setAttachment(
    role: string,
    mediaId: string,
    order = 0,
    theme: string | null = null,
    legacyField?: "coverImage" | "heroImage" | "tallImage" | "clientLogo"
  ) {
    const media = mediaAssets.find((asset) => asset.id === mediaId);
    set("attachments", [
      ...attachments.filter((item) => !(item.role === role && item.order === order && (item.theme ?? null) === theme)),
      ...(mediaId ? [{ role, mediaId, order, theme }] : []),
    ]);
    if (legacyField) set(legacyField, media?.url ?? "");
  }

  function attachmentValue(role: string, order = 0, theme: string | null = null) {
    return attachments.find((item) => item.role === role && item.order === order && (item.theme ?? null) === theme)?.mediaId ?? "";
  }

  function mediaSelect(
    role: string,
    label: string,
    order = 0,
    legacyField?: "coverImage" | "heroImage" | "tallImage" | "clientLogo"
  ) {
    return (
      <MediaPicker
        assets={mediaAssets}
        value={attachmentValue(role, order)}
        onChange={(mediaId) => setAttachment(role, mediaId, order, null, legacyField)}
        label={label}
        uploadFolder="dontforget/projects"
      />
    );
  }

  function selectClient(c: ClientItem) {
    const alreadySelected = form.clientId === c.id;
    setForm((prev) => ({
      ...prev,
      clientId: alreadySelected ? null : c.id,
      client: alreadySelected ? prev.client : c.name,
      clientLogo: alreadySelected ? prev.clientLogo : c.logo ?? prev.clientLogo,
      liveUrl: alreadySelected ? prev.liveUrl : prev.liveUrl || c.website || "",
    }));
    setSaveStatus("unsaved");
  }

  function addGallerySlot() {
    const nextOrder = galleryOrders.length ? Math.max(...galleryOrders) + 1 : 0;
    setAttachment("project_gallery", "", nextOrder);
    set("attachments", [...attachments, { role: "project_gallery", mediaId: "", order: nextOrder }]);
  }

  function removeAttachment(role: string, order = 0) {
    set("attachments", attachments.filter((item) => !(item.role === role && (item.order ?? 0) === order)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("saving");
    setError("");

    const cleanedChallenges = challenges
      .map((challenge) => ({
        ...challenge,
        title: challenge.title.trim(),
        problem: challenge.problem.trim(),
        chosenReason: challenge.chosenReason.trim(),
        proposedSolutions: challenge.proposedSolutions
          .map((solution) => ({ title: solution.title.trim(), description: solution.description.trim() }))
          .filter((solution) => solution.title || solution.description),
      }))
      .filter((challenge) => challenge.title || challenge.problem || challenge.proposedSolutions.length || challenge.chosenReason);

    const cleanedResults = results
      .map((result) => ({
        title: result.title.trim(),
        description: result.description.trim(),
        metric: result.metric?.trim() || undefined,
        mediaId: result.mediaId || undefined,
      }))
      .filter((result) => result.title || result.description || result.metric || result.mediaId);

    const payload = {
      ...form,
      projectType: form.projectType || "website",
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      tagsAr: tagsArInput.split(",").map((t) => t.trim()).filter(Boolean),
      clientGoals: cleanStrings(clientGoals),
      challenges: cleanedChallenges,
      results: cleanedResults,
      attachments: attachments.filter((item) => item.mediaId && item.role),
      serviceIds: selectedServices,
      techStack: selectedTech,
    };

    const url = editing ? `/api/projects/${initial!.id}` : "/api/projects";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setSaving(false);
      setSaveStatus("unsaved");
      return;
    }

    setSaveStatus("idle");
    router.push("/dashboard/projects");
    router.refresh();
  }

  const inp =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
  const lbl = "block text-xs text-white/50 uppercase tracking-widest mb-2";
  const card = "bg-zinc-900 border border-white/[0.06] rounded-xl p-6 space-y-5";
  const sec = "text-sm font-medium text-white/50 uppercase tracking-widest";
  const addBtn = "text-xs text-[#3ABF8A] hover:text-[#2ea876] transition-colors mt-2";
  const removeBtn = "text-xs text-white/25 hover:text-red-300 transition-colors";

  return (
    <form onSubmit={handleSubmit}>
      <div className="sticky top-0 z-20 -mx-8 -mt-8 mb-8 flex items-center justify-between gap-4 border-b border-white/[0.06] bg-zinc-950/90 px-8 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm text-white/45">{form.title || (editing ? "Project" : "New Project")}</p>
          {saveStatus !== "idle" && (
            <p className="mt-0.5 text-xs text-white/25">{saveStatus === "saving" ? "Saving..." : "Unsaved changes"}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={form.status} onChange={(e) => set("status", e.target.value as ProjectData["status"])}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
          <button type="button" onClick={() => router.back()} className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/10">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#3ABF8A] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2ea876] disabled:opacity-50">
            {saving ? "Saving..." : editing ? "Save" : "Create"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        <section className={card}>
          <h2 className={sec}>01 - Project Identity</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={lbl}>Project Name *</label>
              <input className={inp} value={form.title ?? ""} onChange={(e) => {
                set("title", e.target.value);
                if (!editing) set("slug", slugify(e.target.value));
              }} required />
            </div>
            <div>
              <label className={lbl}>Slug *</label>
              <input className={inp} value={form.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} required />
            </div>
            <div>
              <label className={lbl}>Project Type</label>
              <select className={inp} value={form.projectType ?? "website"} onChange={(e) => set("projectType", e.target.value)}>
                {PROJECT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Year</label>
              <input className={inp} value={form.year ?? ""} onChange={(e) => set("year", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={lbl}>Tagline</label>
            <input className={inp} value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Short Description</label>
            <textarea className={`${inp} h-24 resize-none`} value={form.shortDescription ?? ""} onChange={(e) => set("shortDescription", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Full Description</label>
            <textarea className={`${inp} h-40 resize-none`} value={form.fullDescription ?? ""} onChange={(e) => set("fullDescription", e.target.value)} />
          </div>
        </section>

        <section className={card}>
          <h2 className={sec}>02 - Client And Links</h2>
          {clientItems.length > 0 && (
            <div>
              <label className={lbl}>Client Library</label>
              <div className="flex flex-wrap gap-2">
                {clientItems.map((client) => {
                  const selected = form.clientId === client.id;
                  return (
                    <button key={client.id} type="button" onClick={() => selectClient(client)} className={`rounded-lg border px-3 py-2 text-sm transition-colors ${selected ? "border-[#3ABF8A]/40 bg-[#3ABF8A]/10 text-white" : "border-white/10 bg-white/5 text-white/50 hover:text-white"}`}>
                      {client.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={lbl}>Client Name</label>
              <input className={inp} value={form.client ?? ""} onChange={(e) => {
                set("client", e.target.value);
                set("clientId", null);
              }} />
            </div>
            <div>
              <label className={lbl}>Location</label>
              <input className={inp} value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Live URL</label>
              <input className={inp} value={form.liveUrl ?? ""} onChange={(e) => set("liveUrl", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Case Study URL</label>
              <input className={inp} value={form.caseStudyUrl ?? ""} onChange={(e) => set("caseStudyUrl", e.target.value)} />
            </div>
          </div>
          {mediaSelect("project_logo", "Client logo", 0, "clientLogo")}
        </section>

        <section className={card}>
          <h2 className={sec}>03 - Services And Stack</h2>
          {services.length > 0 && (
            <div>
              <label className={lbl}>Connected Services</label>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => {
                  const active = selectedServices.includes(service.id);
                  return (
                    <button key={service.id} type="button" onClick={() => set("serviceIds", active ? selectedServices.filter((id) => id !== service.id) : [...selectedServices, service.id])} className={`rounded-lg border px-3 py-2 text-sm transition-colors ${active ? "border-[#3ABF8A]/40 bg-[#3ABF8A]/12 text-[#3ABF8A]" : "border-white/10 bg-white/5 text-white/50 hover:text-white"}`}>
                      {service.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {techItems.length > 0 && (
            <div>
              <label className={lbl}>Tech Stack</label>
              <div className="flex flex-wrap gap-2">
                {techItems.map((tech) => {
                  const active = selectedTech.includes(tech.id);
                  return (
                    <button key={tech.id} type="button" onClick={() => set("techStack", active ? selectedTech.filter((id) => id !== tech.id) : [...selectedTech, tech.id])} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${active ? "border-[#3ABF8A]/40 bg-[#3ABF8A]/12 text-[#3ABF8A]" : "border-white/10 bg-white/5 text-white/50 hover:text-white"}`}>
                      {tech.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tech.iconUrl} alt="" className="h-4 w-4 object-contain" />
                      ) : tech.icon ? <span>{tech.icon}</span> : null}
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <label className={lbl}>Tags</label>
            <input className={inp} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="comma separated" />
          </div>
        </section>

        <section className={card}>
          <h2 className={sec}>04 - Media Attachments</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mediaSelect("project_cover", "Cover image", 0, "coverImage")}
            {mediaSelect("project_hero", "Hero image", 0, "heroImage")}
            {mediaSelect("project_tall_screenshot", "Tall website screenshot", 0, "tallImage")}
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-white/65">
                <input type="checkbox" checked={!!form.useTallImage} onChange={(e) => set("useTallImage", e.target.checked)} className="h-4 w-4 accent-[#2ea876]" />
                Use tall screenshot on the project page
              </label>
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className={lbl}>Gallery</label>
              <button type="button" onClick={addGallerySlot} className={addBtn}>+ Add gallery item</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(galleryOrders.length ? galleryOrders : [0]).map((order) => (
                <div key={order} className="space-y-2">
                  {mediaSelect("project_gallery", `Gallery item ${order + 1}`, order)}
                  {galleryOrders.length > 0 && <button type="button" onClick={() => removeAttachment("project_gallery", order)} className={removeBtn}>Remove gallery item</button>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className={sec}>05 - Client Goals</h2>
          <div className="space-y-2">
            {clientGoals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <input className={inp} value={goal} onChange={(e) => set("clientGoals", updateAt(clientGoals, index, e.target.value))} placeholder={`Goal ${index + 1}`} />
                {clientGoals.length > 1 && <button type="button" onClick={() => set("clientGoals", clientGoals.filter((_, i) => i !== index))} className={removeBtn}>Remove</button>}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => set("clientGoals", [...clientGoals, ""])} className={addBtn}>+ Add goal</button>
        </section>

        <section className={card}>
          <h2 className={sec}>06 - Challenges And Solutions</h2>
          <div className="space-y-5">
            {challenges.map((challenge, challengeIndex) => (
              <div key={challengeIndex} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-white/30">Challenge {challengeIndex + 1}</p>
                  {challenges.length > 1 && <button type="button" onClick={() => set("challenges", challenges.filter((_, i) => i !== challengeIndex))} className={removeBtn}>Remove</button>}
                </div>
                <input className={inp} value={challenge.title} onChange={(e) => set("challenges", updateAt(challenges, challengeIndex, { ...challenge, title: e.target.value }))} placeholder="Challenge title" />
                <textarea className={`${inp} h-24 resize-none`} value={challenge.problem} onChange={(e) => set("challenges", updateAt(challenges, challengeIndex, { ...challenge, problem: e.target.value }))} placeholder="What was blocking the client?" />
                <div className="space-y-3">
                  <label className={lbl}>Proposed Solutions</label>
                  {challenge.proposedSolutions.map((solution, solutionIndex) => (
                    <div key={solutionIndex} className="rounded-lg border border-white/[0.07] bg-zinc-950/35 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs text-white/45">
                          <input
                            type="radio"
                            checked={challenge.chosenSolutionIndex === solutionIndex}
                            onChange={() => set("challenges", updateAt(challenges, challengeIndex, { ...challenge, chosenSolutionIndex: solutionIndex }))}
                            className="accent-[#2ea876]"
                          />
                          Chosen solution
                        </label>
                        {challenge.proposedSolutions.length > 1 && (
                          <button type="button" onClick={() => {
                            const nextSolutions = challenge.proposedSolutions.filter((_, i) => i !== solutionIndex);
                            set("challenges", updateAt(challenges, challengeIndex, {
                              ...challenge,
                              proposedSolutions: nextSolutions,
                              chosenSolutionIndex: challenge.chosenSolutionIndex === solutionIndex ? null : challenge.chosenSolutionIndex,
                            }));
                          }} className={removeBtn}>Remove</button>
                        )}
                      </div>
                      <input className={inp} value={solution.title} onChange={(e) => {
                        const next = updateAt(challenge.proposedSolutions, solutionIndex, { ...solution, title: e.target.value });
                        set("challenges", updateAt(challenges, challengeIndex, { ...challenge, proposedSolutions: next }));
                      }} placeholder="Solution title" />
                      <textarea className={`${inp} h-20 resize-none`} value={solution.description} onChange={(e) => {
                        const next = updateAt(challenge.proposedSolutions, solutionIndex, { ...solution, description: e.target.value });
                        set("challenges", updateAt(challenges, challengeIndex, { ...challenge, proposedSolutions: next }));
                      }} placeholder="Solution description" />
                    </div>
                  ))}
                  <button type="button" onClick={() => set("challenges", updateAt(challenges, challengeIndex, { ...challenge, proposedSolutions: [...challenge.proposedSolutions, { title: "", description: "" }] }))} className={addBtn}>
                    + Add solution option
                  </button>
                </div>
                <textarea className={`${inp} h-20 resize-none`} value={challenge.chosenReason} onChange={(e) => set("challenges", updateAt(challenges, challengeIndex, { ...challenge, chosenReason: e.target.value }))} placeholder="Why this solution was chosen" />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => set("challenges", [...challenges, emptyChallenge()])} className={addBtn}>+ Add challenge</button>
        </section>

        <section className={card}>
          <h2 className={sec}>07 - Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-white/30">Result {index + 1}</p>
                  {results.length > 1 && <button type="button" onClick={() => set("results", results.filter((_, i) => i !== index))} className={removeBtn}>Remove</button>}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className={inp} value={result.title} onChange={(e) => set("results", updateAt(results, index, { ...result, title: e.target.value }))} placeholder="Result title" />
                  <input className={inp} value={result.metric ?? ""} onChange={(e) => set("results", updateAt(results, index, { ...result, metric: e.target.value }))} placeholder="Metric, optional" />
                </div>
                <textarea className={`${inp} h-24 resize-none`} value={result.description} onChange={(e) => set("results", updateAt(results, index, { ...result, description: e.target.value }))} placeholder="What did we make or improve?" />
                <MediaPicker
                  assets={mediaAssets}
                  value={result.mediaId ?? attachmentValue("project_result", index)}
                  onChange={(mediaId) => {
                    set("results", updateAt(results, index, { ...result, mediaId }));
                    setAttachment("project_result", mediaId, index);
                  }}
                  label="Result media"
                  uploadFolder="dontforget/projects/results"
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => set("results", [...results, emptyResult()])} className={addBtn}>+ Add result</button>
        </section>

        <section className={card}>
          <h2 className={sec}>08 - Testimonial</h2>
          <textarea className={`${inp} h-28 resize-none`} value={form.testimonialText ?? ""} onChange={(e) => set("testimonialText", e.target.value)} placeholder="Client quote" />
          <div className="grid gap-4 md:grid-cols-3">
            <input className={inp} value={form.testimonialAuthor ?? ""} onChange={(e) => set("testimonialAuthor", e.target.value)} placeholder="Author" />
            <input className={inp} value={form.testimonialRole ?? ""} onChange={(e) => set("testimonialRole", e.target.value)} placeholder="Role" />
            <input className={inp} value={form.testimonialCompany ?? ""} onChange={(e) => set("testimonialCompany", e.target.value)} placeholder="Company" />
          </div>
        </section>

        <section className={card}>
          <h2 className={sec}>09 - Extra Mile</h2>
          <div>
            <label className={lbl}>Delivered beyond the brief</label>
            <textarea className={`${inp} h-32 resize-none`} value={form.extraMile ?? ""} onChange={(e) => set("extraMile", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Planned future work</label>
            <textarea className={`${inp} h-28 resize-none`} value={form.extraMilePlanned ?? ""} onChange={(e) => set("extraMilePlanned", e.target.value)} />
          </div>
        </section>

        <section className={card}>
          <h2 className={sec}>10 - Localization And Settings</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={lbl}>Arabic Title</label>
              <input dir="rtl" className={inp} value={form.titleAr ?? ""} onChange={(e) => set("titleAr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Arabic Client</label>
              <input dir="rtl" className={inp} value={form.clientAr ?? ""} onChange={(e) => set("clientAr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Category</label>
              <input className={inp} value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Arabic Category</label>
              <input dir="rtl" className={inp} value={form.categoryAr ?? ""} onChange={(e) => set("categoryAr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Arabic Tags</label>
              <input dir="rtl" className={inp} value={tagsArInput} onChange={(e) => setTagsArInput(e.target.value)} placeholder="comma separated" />
            </div>
            <div>
              <label className={lbl}>GitHub URL</label>
              <input className={inp} value={form.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={lbl}>Arabic Description</label>
            <textarea dir="rtl" className={`${inp} h-24 resize-none`} value={form.descriptionAr ?? ""} onChange={(e) => set("descriptionAr", e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className={lbl}>Order</label>
              <input type="number" className={`${inp} w-28`} value={form.order ?? 0} onChange={(e) => set("order", Number(e.target.value))} />
            </div>
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-white/60">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-[#2ea876]" />
              Featured project
            </label>
          </div>
        </section>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-4 pb-20">
          <button type="submit" disabled={saving} className="rounded-lg bg-[#3ABF8A] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2ea876] disabled:opacity-50">
            {saving ? "Saving..." : editing ? "Save Changes" : "Create Project"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg bg-white/5 px-6 py-3 text-sm text-white/60 transition-colors hover:bg-white/10">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
