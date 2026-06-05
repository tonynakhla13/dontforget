"use client";

import { useState, useRef } from "react";
import type { DragEvent, ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaPicker from "./MediaPicker";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

type MediaAssetItem = { id: string; url: string; originalName?: string | null; filename?: string | null; mimeType?: string; alt?: string | null };
type TechItem = { id: string; name: string; icon?: string | null; iconUrl?: string | null };
type ProjectItem = { id: string; title: string; slug: string };
type AttachmentInput = { mediaId: string; role: string; theme?: string | null; order?: number };

type DeliverableItem = {
  icon: string;         // stored URL
  iconMediaId: string;  // form picker value
  title: string;
  description: string;  // HTML from Tiptap
  highlight: boolean;
  image: string;        // stored URL for optional image/GIF
  imageMediaId: string; // form picker value
};
type ProcessStep = { title: string; description: string };
type FaqItem = { question: string; answer: string };

type ServiceInitial = {
  id: string;
  title: string; titleAr?: string | null;
  slug: string;
  description?: string | null; descriptionAr?: string | null;
  shortDescription?: string | null;
  tagline?: string | null;
  benefits: unknown;
  deliverables: unknown;
  process: unknown;
  techStack: unknown;
  featured: boolean;
  seoTitle?: string | null; seoDescription?: string | null;
  icon?: string | null;
  order: number;
  active: boolean;
  faq: unknown;
  ctaHeadline?: string | null;
  ctaSubtext?: string | null;
  ctaButtonLabel?: string | null;
  ctaButtonLink?: string | null;
  attachments?: AttachmentInput[];
  projectIds?: string[];
};

function toStringIds(val: unknown): string[] {
  return Array.isArray(val) ? val.filter((id): id is string => typeof id === "string") : [];
}

function toStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) return String((item as Record<string, unknown>).title ?? "");
      return "";
    })
    .filter(Boolean);
}

function toDeliverables(val: unknown, mediaAssets: MediaAssetItem[]): DeliverableItem[] {
  const urlToId = new Map(mediaAssets.map((a) => [a.url, a.id]));
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      const icon = String(obj.icon ?? "");
      const image = String(obj.image ?? "");
      return {
        icon,
        iconMediaId: urlToId.get(icon) ?? "",
        title: String(obj.title ?? ""),
        description: String(obj.description ?? ""),
        highlight: Boolean(obj.highlight),
        image,
        imageMediaId: urlToId.get(image) ?? "",
      };
    }
    if (typeof item === "string") return { icon: "", iconMediaId: "", title: item, description: "", highlight: false, image: "", imageMediaId: "" };
    return { icon: "", iconMediaId: "", title: "", description: "", highlight: false, image: "", imageMediaId: "" };
  });
}

function toProcessSteps(val: unknown): ProcessStep[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      return { title: String(obj.title ?? ""), description: String(obj.description ?? "") };
    }
    if (typeof item === "string") return { title: item, description: "" };
    return { title: "", description: "" };
  });
}

function toFaqItems(val: unknown): FaqItem[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      return { question: String(obj.question ?? ""), answer: String(obj.answer ?? "") };
    }
    return { question: "", answer: "" };
  });
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function useDragReorder<T>(items: T[], setItems: (items: T[]) => void) {
  const dragIndex = useRef<number | null>(null);
  return {
    handleDragStart: (i: number) => { dragIndex.current = i; },
    handleDragOver: (e: DragEvent, i: number) => {
      e.preventDefault();
      if (dragIndex.current === null || dragIndex.current === i) return;
      const next = [...items];
      const [moved] = next.splice(dragIndex.current, 1);
      next.splice(i, 0, moved);
      dragIndex.current = i;
      setItems(next);
    },
    handleDrop: () => { dragIndex.current = null; },
  };
}

function SectionHead({ heading, action }: { heading: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
      <h2 className="text-xs font-medium text-white/50 uppercase tracking-widest">{heading}</h2>
      {action}
    </div>
  );
}

function AddBtn({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <button type="button" onClick={onClick} className="text-xs text-[#3ABF8A] hover:text-[#2ea876] transition-colors">
      + {text}
    </button>
  );
}

export default function ServiceForm({
  initial,
  projects,
  techItems,
  mediaAssets,
}: {
  initial: ServiceInitial;
  projects: ProjectItem[];
  techItems: TechItem[];
  mediaAssets: MediaAssetItem[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [titleAr, setTitleAr] = useState(initial.titleAr ?? "");
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState(initial.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(initial.descriptionAr ?? "");
  const [shortDescription, setShortDescription] = useState(initial.shortDescription ?? "");
  const [tagline, setTagline] = useState(initial.tagline ?? "");
  const [icon, setIcon] = useState(initial.icon ?? "");
  const [order, setOrder] = useState(initial.order);
  const [featured, setFeatured] = useState(initial.featured);
  const [activeFlag, setActiveFlag] = useState(initial.active);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription ?? "");
  const [ctaHeadline, setCtaHeadline] = useState(initial.ctaHeadline ?? "");
  const [ctaSubtext, setCtaSubtext] = useState(initial.ctaSubtext ?? "");
  const [ctaButtonLabel, setCtaButtonLabel] = useState(initial.ctaButtonLabel ?? "");
  const [ctaButtonLink, setCtaButtonLink] = useState(initial.ctaButtonLink ?? "");

  const [techStack, setTechStack] = useState<string[]>(toStringIds(initial.techStack));
  const [benefitsText, setBenefitsText] = useState(toStringArray(initial.benefits).join("\n"));
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(toDeliverables(initial.deliverables, mediaAssets));
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(toProcessSteps(initial.process));
  const [faqItems, setFaqItems] = useState<FaqItem[]>(toFaqItems(initial.faq));
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(initial.projectIds ?? []);
  const [attachments, setAttachments] = useState<AttachmentInput[]>(initial.attachments ?? []);
  const [saving, setSaving] = useState(false);

  const deliverablesDrag = useDragReorder(deliverables, setDeliverables);
  const processDrag = useDragReorder(processSteps, setProcessSteps);
  const faqDrag = useDragReorder(faqItems, setFaqItems);

  function setAttachment(role: string, mediaId: string, theme: string | null = null) {
    setAttachments((prev) => [
      ...prev.filter((item) => !(item.role === role && (item.theme ?? null) === theme)),
      ...(mediaId ? [{ role, mediaId, theme, order: 0 }] : []),
    ]);
  }
  function attachmentValue(role: string, theme: string | null = null) {
    return attachments.find((item) => item.role === role && (item.theme ?? null) === theme)?.mediaId ?? "";
  }

  function toggleTech(id: string) {
    setTechStack((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  function addDeliverable() {
    setDeliverables((prev) => [...prev, { icon: "", iconMediaId: "", title: "", description: "", highlight: false, image: "", imageMediaId: "" }]);
  }

  function resolveMediaUrl(mediaId: string) {
    return mediaAssets.find((a) => a.id === mediaId)?.url ?? "";
  }
  function updateDeliverable(i: number, key: keyof DeliverableItem, value: string | boolean) {
    setDeliverables((prev) => prev.map((item, idx) => idx === i ? { ...item, [key]: value } : item));
  }
  function removeDeliverable(i: number) {
    setDeliverables((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addProcessStep() {
    setProcessSteps((prev) => [...prev, { title: "", description: "" }]);
  }
  function updateProcessStep(i: number, key: keyof ProcessStep, value: string) {
    setProcessSteps((prev) => prev.map((item, idx) => idx === i ? { ...item, [key]: value } : item));
  }
  function removeProcessStep(i: number) {
    setProcessSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addFaqItem() {
    setFaqItems((prev) => [...prev, { question: "", answer: "" }]);
  }
  function updateFaqQuestion(i: number, value: string) {
    setFaqItems((prev) => prev.map((item, idx) => idx === i ? { ...item, question: value } : item));
  }
  function updateFaqAnswer(i: number, value: string) {
    setFaqItems((prev) => prev.map((item, idx) => idx === i ? { ...item, answer: value } : item));
  }
  function removeFaqItem(i: number) {
    setFaqItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function toggleProject(id: string) {
    setSelectedProjectIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  async function save() {
    setSaving(true);
    const resolvedDeliverables = deliverables.map((item) => ({
      icon: item.iconMediaId ? resolveMediaUrl(item.iconMediaId) : item.icon,
      title: item.title,
      description: item.description,
      highlight: item.highlight,
      image: item.imageMediaId ? resolveMediaUrl(item.imageMediaId) : item.image,
    }));
    const payload = {
      title, titleAr, slug: slug || slugify(title),
      description, descriptionAr, shortDescription, tagline, icon,
      order, featured, active: activeFlag,
      seoTitle, seoDescription,
      benefits: benefitsText.split("\n").map((s) => s.trim()).filter(Boolean),
      techStack,
      deliverables: resolvedDeliverables,
      process: processSteps,
      faq: faqItems,
      ctaHeadline, ctaSubtext, ctaButtonLabel, ctaButtonLink,
      attachments,
      projectIds: selectedProjectIds,
    };
    const res = await fetch(`/api/services/${initial.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert((data as { error?: string }).error ?? "Save failed");
      return;
    }
    router.push("/dashboard/services");
  }

  const inp = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
  const lbl = "block text-xs text-white/50 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-6 max-w-4xl">

      {/* 01 — Basic Info */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-5">
        <SectionHead heading="01 — Basic Info" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Title *</label>
            <input className={inp} value={title} onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} />
          </div>
          <div>
            <label className={lbl}>Slug *</label>
            <input className={inp} value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
          </div>
          <div>
            <label className={lbl}>Icon</label>
            <input className={inp} value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. 01" />
          </div>
          <div>
            <label className={lbl}>Tagline</label>
            <input className={inp} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={lbl}>Short Description</label>
          <textarea className={`${inp} h-20 resize-none`} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Description</label>
          <RichTextEditor value={description} onChange={setDescription} minHeight="120px" />
        </div>
        <div>
          <label className={lbl}>Cover Image</label>
          <MediaPicker assets={mediaAssets} value={attachmentValue("cover_image", null)} onChange={(mediaId) => setAttachment("cover_image", mediaId, null)} label="Cover image" />
        </div>
      </section>

      {/* 02 — Deliverables */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <SectionHead heading="02 — Deliverables" action={<AddBtn onClick={addDeliverable} text="Add Deliverable" />} />
        {deliverables.length === 0 && <p className="text-sm text-white/30">No deliverables yet.</p>}
        {deliverables.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => deliverablesDrag.handleDragStart(i)}
            onDragOver={(e) => deliverablesDrag.handleDragOver(e, i)}
            onDrop={deliverablesDrag.handleDrop}
            className="bg-white/[0.03] border border-white/5 rounded-lg p-4 space-y-4 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/20 text-base select-none">⠿</span>
              <button type="button" onClick={() => removeDeliverable(i)} className="text-xs text-white/20 hover:text-red-400 transition-colors">Remove</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Icon — PNG / SVG / GIF</label>
                <MediaPicker
                  assets={mediaAssets}
                  value={item.iconMediaId}
                  onChange={(mediaId) => updateDeliverable(i, "iconMediaId", mediaId)}
                  label="Pick icon"
                />
              </div>
              <div>
                <label className={lbl}>Title</label>
                <input className={inp} value={item.title} onChange={(e) => updateDeliverable(i, "title", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={lbl}>Description</label>
              <RichTextEditor
                value={item.description}
                onChange={(html) => updateDeliverable(i, "description", html)}
                minHeight="80px"
              />
            </div>
            <div>
              <label className={lbl}>Image / GIF <span className="text-white/20 normal-case tracking-normal">(optional)</span></label>
              <MediaPicker
                assets={mediaAssets}
                value={item.imageMediaId}
                onChange={(mediaId) => updateDeliverable(i, "imageMediaId", mediaId)}
                label="Pick image or GIF"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={item.highlight} onChange={(e) => updateDeliverable(i, "highlight", e.target.checked)} className="accent-[#2ea876]" />
              <span className="text-xs text-white/50">Highlight this deliverable</span>
            </label>
          </div>
        ))}
      </section>

      {/* 03 — Process */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <SectionHead heading="03 — Process" action={<AddBtn onClick={addProcessStep} text="Add Step" />} />
        {processSteps.length === 0 && <p className="text-sm text-white/30">No steps yet.</p>}
        {processSteps.map((step, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => processDrag.handleDragStart(i)}
            onDragOver={(e) => processDrag.handleDragOver(e, i)}
            onDrop={processDrag.handleDrop}
            className="bg-white/[0.03] border border-white/5 rounded-lg p-4 space-y-3 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/30 text-xs font-mono">Step {String(i + 1).padStart(2, "0")}</span>
              <div className="flex items-center gap-4">
                <span className="text-white/20 text-base select-none">⠿</span>
                <button type="button" onClick={() => removeProcessStep(i)} className="text-xs text-white/20 hover:text-red-400 transition-colors">Remove</button>
              </div>
            </div>
            <div>
              <label className={lbl}>Title</label>
              <input className={inp} value={step.title} onChange={(e) => updateProcessStep(i, "title", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Description</label>
              <textarea className={`${inp} h-20 resize-none`} value={step.description} onChange={(e) => updateProcessStep(i, "description", e.target.value)} />
            </div>
          </div>
        ))}
      </section>

      {/* 04 — Related Projects */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <SectionHead heading="04 — Related Projects" />
        {projects.length === 0 ? (
          <p className="text-sm text-white/30">No projects in the system yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {projects.map((project) => (
              <label key={project.id} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5 cursor-pointer hover:border-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedProjectIds.includes(project.id)}
                  onChange={() => toggleProject(project.id)}
                  className="accent-[#2ea876]"
                />
                <div>
                  <div className="text-sm text-white">{project.title}</div>
                  <div className="text-xs text-white/30">{project.slug}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* 05 — FAQ */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <SectionHead heading="05 — FAQ" action={<AddBtn onClick={addFaqItem} text="Add Question" />} />
        {faqItems.length === 0 && <p className="text-sm text-white/30">No FAQ items yet.</p>}
        {faqItems.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => faqDrag.handleDragStart(i)}
            onDragOver={(e) => faqDrag.handleDragOver(e, i)}
            onDrop={faqDrag.handleDrop}
            className="bg-white/[0.03] border border-white/5 rounded-lg p-4 space-y-3 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/20 text-base select-none">⠿</span>
              <button type="button" onClick={() => removeFaqItem(i)} className="text-xs text-white/20 hover:text-red-400 transition-colors">Remove</button>
            </div>
            <div>
              <label className={lbl}>Question</label>
              <input className={inp} value={item.question} onChange={(e) => updateFaqQuestion(i, e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Answer</label>
              <RichTextEditor value={item.answer} onChange={(html) => updateFaqAnswer(i, html)} minHeight="80px" />
            </div>
          </div>
        ))}
      </section>

      {/* 06 — CTA Block */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <SectionHead heading="06 — CTA Block" />
        <div>
          <label className={lbl}>Headline</label>
          <input className={inp} value={ctaHeadline} onChange={(e) => setCtaHeadline(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Subtext</label>
          <textarea className={`${inp} h-20 resize-none`} value={ctaSubtext} onChange={(e) => setCtaSubtext(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Button Label</label>
            <input className={inp} value={ctaButtonLabel} onChange={(e) => setCtaButtonLabel(e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Button Link</label>
            <input className={inp} value={ctaButtonLink} onChange={(e) => setCtaButtonLink(e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6">
        <SectionHead heading="Benefits" />
        <textarea className={`${inp} h-32 resize-none`} value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} placeholder="One benefit per line" />
      </section>

      {/* Tech Stack — same as ServicesManager */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
          <h2 className="text-xs font-medium text-white/50 uppercase tracking-widest">Tech Stack</h2>
          <a href="/dashboard/tech" target="_blank" className="text-xs text-white/25 hover:text-white/60 transition-colors">Manage tech</a>
        </div>
        {techItems.length ? (
          <div className="flex flex-wrap gap-2">
            {techItems.map((tech) => {
              const isSelected = techStack.includes(tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${isSelected ? "border-[#3ABF8A]/45 bg-[#3ABF8A]/12 text-[#3ABF8A]" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"}`}
                >
                  {tech.iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tech.iconUrl} alt="" className="h-4 w-4 object-contain" />
                  ) : tech.icon ? (
                    <span className="text-xs">{tech.icon}</span>
                  ) : null}
                  {tech.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-white/30">No tech items yet.</p>
        )}
      </section>

      {/* Theme Media — same as ServicesManager */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6">
        <SectionHead heading="Theme Media" />
        <div className="grid grid-cols-2 gap-4">
          <MediaPicker assets={mediaAssets} value={attachmentValue("creative_default", "creative")} onChange={(id) => setAttachment("creative_default", id, "creative")} label="Creative default" />
          <MediaPicker assets={mediaAssets} value={attachmentValue("creative_hover", "creative")} onChange={(id) => setAttachment("creative_hover", id, "creative")} label="Creative hover" />
          <MediaPicker assets={mediaAssets} value={attachmentValue("immersive_left", "immersive")} onChange={(id) => setAttachment("immersive_left", id, "immersive")} label="Immersive left" />
          <MediaPicker assets={mediaAssets} value={attachmentValue("immersive_right", "immersive")} onChange={(id) => setAttachment("immersive_right", id, "immersive")} label="Immersive right" />
          <MediaPicker assets={mediaAssets} value={attachmentValue("immersive_shape", "immersive")} onChange={(id) => setAttachment("immersive_shape", id, "immersive")} label="Immersive shape" />
          <MediaPicker assets={mediaAssets} value={attachmentValue("focused_icon", "focused")} onChange={(id) => setAttachment("focused_icon", id, "focused")} label="Focused icon" />
        </div>
      </section>

      {/* SEO */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <SectionHead heading="SEO" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>SEO Title</label>
            <input className={inp} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div>
            <label className={lbl}>SEO Description</label>
            <input className={inp} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
          </div>
        </div>
      </section>

      {/* Arabic Content */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <SectionHead heading="Arabic Content" />
        <div>
          <label className={lbl}>Arabic Title</label>
          <input dir="rtl" className={inp} value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="عنوان الخدمة" />
        </div>
        <div>
          <label className={lbl}>Arabic Description</label>
          <textarea dir="rtl" className={`${inp} h-24 resize-none`} value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} />
        </div>
      </section>

      {/* Settings */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6">
        <SectionHead heading="Settings" />
        <div className="flex items-center gap-6">
          <div>
            <label className={lbl}>Order</label>
            <input type="number" className={`${inp} w-24`} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#2ea876]" />
            <span className="text-sm text-white/60">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input type="checkbox" checked={activeFlag} onChange={(e) => setActiveFlag(e.target.checked)} className="accent-[#2ea876]" />
            <span className="text-sm text-white/60">Active</span>
          </label>
        </div>
      </section>

      {/* Save */}
      <div className="flex gap-3 pb-8">
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm px-8 py-3 rounded-lg transition-colors font-medium"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <Link href="/dashboard/services" className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-8 py-3 rounded-lg transition-colors inline-flex items-center">
          Cancel
        </Link>
      </div>
    </div>
  );
}
