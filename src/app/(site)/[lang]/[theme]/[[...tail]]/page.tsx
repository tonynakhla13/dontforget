import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, isTheme } from "@/i18n/config";
import { getContact, getPost, getPosts, getProject, getProjects, getService, getServices, getTeam } from "@/lib/public-content";
import { pagePath, postPath, projectPath, servicePath, validTail, type Locale, type Theme } from "@/lib/site-routing";
import SiteShell from "@/components/site/SiteShell";
import InquiryForm from "@/components/site/InquiryForm";
import CanonicalPresentation from "@/components/site/CanonicalPresentation";
import FloatingPreferenceControls from "@/components/site/FloatingPreferenceControls";
import FocusedThemeLayout from "@/themes/focused/layout";
import FocusedHome from "@/themes/focused/page";
import FocusedAbout from "@/themes/focused/about/page";
import FocusedWork from "@/themes/focused/work/page";
import FocusedServices from "@/themes/focused/services/page";
import FocusedBlog from "@/themes/focused/blog/page";
import BlogPostFocused from "@/components/focused/BlogPostFocused";
import ProjectContentFocused from "@/components/focused/ProjectContentFocused";
import FocusedContact from "@/themes/focused/contact/page";
import ServiceDetailFocused from "@/components/focused/ServiceDetailFocused";
import CreativeThemeLayout from "@/themes/creative/layout";
import CreativeHome from "@/themes/creative/page";
import CreativeAbout from "@/themes/creative/about/page";
import CreativeWork from "@/themes/creative/work/page";
import CreativeServices from "@/themes/creative/services/page";
import CreativeBlog from "@/themes/creative/blog/page";
import CreativeContact from "@/themes/creative/contact/page";
import ServiceDetailCreative from "@/components/creative/ServiceDetailCreative";
import BlogPostCreative from "@/components/creative/BlogPostCreative";
import ProjectContentCreative from "@/components/creative/ProjectContentCreative";
import { getProject as getFullProject } from "@/features/work/[slug]/page";
import BlogPostImmersive from "@/components/immersive/BlogPostImmersive";
import ServiceDetailImmersive from "@/components/immersive/ServiceDetailImmersive";
import ImmersiveThemeLayout from "@/themes/immersive/layout";
import ImmersiveHome from "@/themes/immersive/page";
import ImmersiveAbout from "@/themes/immersive/about/page";
import ImmersiveWork from "@/themes/immersive/work/page";
import ImmersiveServices from "@/themes/immersive/services/page";
import ImmersiveBlog from "@/themes/immersive/blog/page";
import ImmersiveContact from "@/themes/immersive/contact/page";
import ImmersiveProject from "@/features/work/[slug]/page";
import ImmersiveService from "@/features/services/[id]/page";
import RequestPage from "@/features/request/page";

type Params = Promise<{ lang: string; theme: string; tail?: string[] }>;

async function routeParams(params: Params) {
  const value = await params;
  if (!isLocale(value.lang) || !isTheme(value.theme) || !validTail(value.tail ?? [])) notFound();
  return { locale: value.lang, theme: value.theme, tail: value.tail ?? [] };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, theme, tail } = await routeParams(params);
  const tailPath = tail.length ? `/${tail.join("/")}` : "";

  /* ── Individual blog post — rich OG metadata ── */
  if (tail[0] === "blog" && tail[1]) {
    const post = await getPost(locale, tail[1]);
    if (post) {
      const desc = post.excerpt ?? post.content.replace(/[#*`]/g, "").substring(0, 155).trimEnd() + "…";
      return {
        title:       `${post.title} — NOX Studio`,
        description: desc,
        keywords:    post.tags.join(", "),
        openGraph: {
          type:             "article",
          title:            post.title,
          description:      desc,
          ...(post.coverImage && { images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] }),
          ...(post.publishedAt && { publishedTime: new Date(post.publishedAt).toISOString() }),
          tags:             post.tags,
          siteName:         "NOX Studio",
        },
        twitter: {
          card:        "summary_large_image",
          title:       post.title,
          description: desc,
          ...(post.coverImage && { images: [post.coverImage] }),
        },
        alternates: { languages: { en: `/en/${theme}${tailPath}`, ar: `/ar/${theme}${tailPath}` } },
      };
    }
  }

  /* ── Default page metadata ── */
  const d = await getDictionary(locale);
  const page = tail[0] as keyof typeof d.pages | undefined;
  const title = page ? `${d.pages[page][0]} - ${d.brand}` : d.meta.title;
  return {
    title,
    description: page ? d.pages[page][1] : d.meta.description,
    alternates: { languages: { en: `/en/${theme}${tailPath}`, ar: `/ar/${theme}${tailPath}` } },
  };
}

export default async function ThemePage({ params }: { params: Params }) {
  const { locale, theme, tail } = await routeParams(params);
  const d = await getDictionary(locale);
  const recovered = await renderRecoveredPresentation(locale, theme, tail);
  if (recovered) {
    return (
      <CanonicalPresentation locale={locale} theme={theme}>
        {recovered}
        <FloatingPreferenceControls locale={locale} theme={theme} labels={d.controls} />
      </CanonicalPresentation>
    );
  }
  const content = await renderContent(locale, theme, tail, d);
  return <SiteShell locale={locale} theme={theme} dictionary={d}>{content}</SiteShell>;
}

async function renderRecoveredPresentation(locale: Locale, theme: Theme, tail: string[]) {
  const page = tail[0] ?? "home";
  if (theme === "focused") {
    if (page === "services" && tail[1]) {
      const service = await getService(locale, tail[1]);
      if (!service) return null;
      return <FocusedThemeLayout><ServiceDetailFocused service={service} locale={locale} /></FocusedThemeLayout>;
    }
    if (page === "blog" && tail[1]) {
      const post = await getPost(locale, tail[1]);
      if (!post) return null;
      return <FocusedThemeLayout><BlogPostFocused post={post} locale={locale} /></FocusedThemeLayout>;
    }
    if (page === "work" && tail[1]) {
      const project = await getFullProject(tail[1]);
      if (!project) return null;
      return <FocusedThemeLayout><ProjectContentFocused project={project} /></FocusedThemeLayout>;
    }
    const view = page === "home" ? <FocusedHome /> :
      page === "about" && !tail[1] ? <FocusedAbout /> :
      page === "work" && !tail[1] ? <FocusedWork locale={locale} /> :
      page === "services" && !tail[1] ? <FocusedServices /> :
      page === "blog" && !tail[1] ? <FocusedBlog /> :
      page === "contact" && !tail[1] ? <FocusedContact /> : null;
    return view ? <FocusedThemeLayout>{view}</FocusedThemeLayout> : null;
  }
  if (theme === "creative") {
    if (page === "services" && tail[1]) {
      const service = await getService(locale, tail[1]);
      if (!service) return null;
      return <CreativeThemeLayout><ServiceDetailCreative service={service} locale={locale} /></CreativeThemeLayout>;
    }
    if (page === "blog" && tail[1]) {
      const post = await getPost(locale, tail[1]);
      if (!post) return null;
      return <CreativeThemeLayout><BlogPostCreative post={post} locale={locale} /></CreativeThemeLayout>;
    }
    if (page === "work" && tail[1]) {
      const project = await getFullProject(tail[1]);
      if (!project) return null;
      return <CreativeThemeLayout><ProjectContentCreative project={project} /></CreativeThemeLayout>;
    }
    if (page === "work" && !tail[1]) {
      const projects = await getProjects(locale);
      return <CreativeThemeLayout><CreativeWork locale={locale} projects={projects} /></CreativeThemeLayout>;
    }
    const view = page === "home" ? <CreativeHome locale={locale} /> :
      page === "about" && !tail[1] ? <CreativeAbout /> :
      page === "services" && !tail[1] ? <CreativeServices locale={locale} /> :
      page === "blog" && !tail[1] ? <CreativeBlog locale={locale} /> :
      page === "contact" && !tail[1] ? <CreativeContact /> : null;
    return view ? <CreativeThemeLayout>{view}</CreativeThemeLayout> : null;
  }
  if (theme === "immersive") {
    const view = await renderImmersiveView(locale, page, tail);
    return view ? <ImmersiveThemeLayout>{view}</ImmersiveThemeLayout> : null;
  }
  if (page === "request" && !tail[1]) return <RequestPage />;
  return null;
}

async function renderImmersiveView(locale: Locale, page: string, tail: string[]) {
  if (page === "home") {
    const [projects, services] = await Promise.all([getProjects(locale), getServices(locale)]);
    return <ImmersiveHome projects={projects} services={services} />;
  }
  if (page === "about" && !tail[1]) return <ImmersiveAbout />;
  if (page === "work" && !tail[1]) return <ImmersiveWork locale={locale} />;
  if (page === "services" && !tail[1]) return <ImmersiveServices />;
  if (page === "blog" && !tail[1]) return <ImmersiveBlog locale={locale} />;
  if (page === "blog" && tail[1]) {
    const post = await getPost(locale, tail[1]);
    if (!post) return null;
    return <BlogPostImmersive post={post} locale={locale} />;
  }
  if (page === "contact" && !tail[1]) return <ImmersiveContact />;
  if (page === "work" && tail[1]) return <ImmersiveProject params={Promise.resolve({ slug: tail[1] })} />;
  if (page === "services" && tail[1]) {
    const service = await getServiceWithAliases(locale, tail[1]);
    if (service) return <ServiceDetailImmersive service={service} />;
    return <ImmersiveService params={Promise.resolve({ id: tail[1] })} />;
  }
  return null;
}

async function getServiceWithAliases(locale: Locale, id: string) {
  const aliases: Record<string, string[]> = {
    webdev: ["web-development"],
    uiux: ["ui-ux-design", "ui-ux"],
    ecomm: ["ecommerce", "e-commerce"],
    mobile: ["mobile-apps"],
    seo: ["seo-site-health", "seo"],
    crm: ["crm-systems"],
  };
  const candidates = [id, ...(aliases[id] ?? [])];
  for (const candidate of candidates) {
    const service = await getService(locale, candidate);
    if (service) return service;
  }
  return null;
}

async function renderContent(locale: Locale, theme: Theme, tail: string[], d: Awaited<ReturnType<typeof getDictionary>>) {
  const page = tail[0];
  if (!page) {
    const projects = await getProjects(locale);
    return (
      <main>
        <section className="site-hero">
          <p className="eyebrow">{d.home.eyebrow}</p>
          <h1>{d.home.title}</h1>
          <p className="lede">{d.home.body}</p>
          <div className="hero-actions">
            <Link className="site-button" href={pagePath(locale, theme, "work")}>{d.home.work}</Link>
            <Link className="site-button secondary" href={pagePath(locale, theme, "contact")}>{d.home.contact}</Link>
          </div>
        </section>
        <Cards title={d.home.projects} items={projects.map((item) => ({ href: projectPath(locale, theme, item.slug), title: item.title, description: item.description, eyebrow: item.category }))} action={d.labels.viewProject} />
      </main>
    );
  }
  if (page === "about") {
    const team = await getTeam(locale);
    return <main><Intro title={d.pages.about[0]} body={d.pages.about[1]} /><Cards title={locale === "ar" ? "الفريق" : "Our team"} items={team.map((member) => ({ title: member.name, eyebrow: member.role, description: member.bio }))} /></main>;
  }
  if (page === "work" && tail[1]) {
    const project = await getProject(locale, tail[1]);
    if (!project) notFound();
    return <Detail title={project.title} intro={project.description} back={pagePath(locale, theme, "work")} backLabel={d.labels.back} rows={[[d.labels.client, project.client], [d.labels.category, project.category], [d.labels.year, project.year]]} tags={project.tags} />;
  }
  if (page === "work") {
    const projects = await getProjects(locale);
    return <main><Intro title={d.pages.work[0]} body={d.pages.work[1]} /><Cards items={projects.map((item) => ({ href: projectPath(locale, theme, item.slug), title: item.title, description: item.description, eyebrow: item.category }))} action={d.labels.viewProject} /></main>;
  }
  if (page === "services" && tail[1]) {
    const service = await getService(locale, tail[1]);
    if (!service) notFound();
    return <Detail title={service.title} intro={service.description} back={pagePath(locale, theme, "services")} backLabel={d.labels.back} rows={[]} tags={[]} />;
  }
  if (page === "services") {
    const services = await getServices(locale);
    return <main><Intro title={d.pages.services[0]} body={d.pages.services[1]} /><Cards items={services.map((item) => ({ href: servicePath(locale, theme, item.id), title: item.title, description: item.description, eyebrow: item.icon }))} action={d.labels.viewService} /></main>;
  }
  if (page === "blog" && tail[1]) {
    const post = await getPost(locale, tail[1]);
    if (!post) notFound();
    return (
      <main className="article">
        <Link href={pagePath(locale, theme, "blog")} className="back-link">{d.labels.back}</Link>
        <p className="eyebrow">{post.tags.join(" / ")}</p><h1>{post.title}</h1>{post.excerpt ? <p className="lede">{post.excerpt}</p> : null}
        <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div>
      </main>
    );
  }
  if (page === "blog") {
    const posts = await getPosts(locale);
    return <main><Intro title={d.pages.blog[0]} body={d.pages.blog[1]} /><Cards items={posts.map((item) => ({ href: postPath(locale, theme, item.slug), title: item.title, description: item.excerpt, eyebrow: item.tags[0] }))} action={d.labels.readMore} /></main>;
  }
  if (page === "contact" || page === "request") {
    const contact = await getContact(locale);
    const copy = d.pages[page];
    return <main className="contact-page"><Intro title={contact?.headline ?? copy[0]} body={contact?.subheadline ?? copy[1]} /><InquiryForm labels={d.form} /><aside>{contact?.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}{contact?.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : null}<p>{contact?.address}</p></aside></main>;
  }
  notFound();
}

function Intro({ title, body }: { title: string; body: string }) {
  return <section className="page-intro"><h1>{title}</h1><p className="lede">{body}</p></section>;
}
function Cards({ title, items, action }: { title?: string; items: { href?: string; title: string; description?: string | null; eyebrow?: string | null }[]; action?: string }) {
  return <section className="site-list">{title ? <h2>{title}</h2> : null}<div className="card-grid">{items.map((item) => {
    const body = <><p className="eyebrow">{item.eyebrow}</p><h3>{item.title}</h3>{item.description ? <p>{item.description}</p> : null}{action ? <span>{action}</span> : null}</>;
    return item.href ? <Link className="site-card" href={item.href} key={item.title}>{body}</Link> : <article className="site-card" key={item.title}>{body}</article>;
  })}</div></section>;
}
function Detail({ title, intro, back, backLabel, rows, tags }: { title: string; intro: string | null; back: string; backLabel: string; rows: [string, string | null][]; tags: string[] }) {
  return <main className="detail-page"><Link href={back} className="back-link">{backLabel}</Link><h1>{title}</h1>{intro ? <p className="lede">{intro}</p> : null}<dl>{rows.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="tag-list">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></main>;
}
