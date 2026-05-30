/**
 * Standalone blog post seeder — safe to run any time.
 * Uses upsert (by slug) so it never deletes or duplicates.
 *
 * Run with:
 *   node_modules/.bin/jiti prisma/seed-posts.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
// @ts-ignore — adapter typing varies by Prisma version
const prisma = new PrismaClient({ adapter });

const now = new Date();

const POSTS = [
  {
    slug: "why-slow-websites-lose-more-than-rankings",
    title: "Why slow websites lose more than just rankings",
    titleAr: "لماذا تخسر المواقع البطيئة أكثر من مجرد ترتيب في البحث",
    excerpt: "Speed is not just a technical metric — it is the first impression your brand makes on every visitor.",
    excerptAr: "السرعة ليست مجرد مقياس تقني — إنها الانطباع الأول الذي تتركه علامتك التجارية لدى كل زائر.",
    tags: ["Performance", "SEO"],
    tagsAr: ["الأداء", "تحسين محركات البحث"],
    order: 1,
    publishedAt: now,
    status: "PUBLISHED" as const,
    content: `## Speed is part of your brand

Most businesses think of a slow website as a technical problem — something for the developer to fix quietly before launch. The reality is more visible than that.

When a page takes more than three seconds to load, a large portion of visitors leave before they see anything. They do not wait. They go somewhere else. That lost visitor is a lost opportunity before a single word of your website was read.

### What actually breaks

A slow website damages more than bounce rate. It shapes perception. A slow page tells the visitor one of three things — the company does not care about their time, the company does not invest in quality, or the product behind the website probably runs the same way.

None of those are impressions you want to create.

### The performance budget idea

A performance budget is a simple framework: you set an upper limit on how heavy a page is allowed to be, and you design within that limit from the start — not at the end when everything is already built.

This means:

- Compressing images before uploading, not as an afterthought
- Loading only the JavaScript your page actually needs
- Deferring scripts that can wait until the page is visible
- Choosing hosting that is fast for your actual audience, not just fast in benchmark screenshots

### Speed and search

Google has made loading speed a ranking signal since Core Web Vitals became part of how it evaluates pages. A slow website is not penalized dramatically — but a fast competitor gets a measurable edge.

More importantly, a fast website keeps the visitor long enough to actually read what you wrote and decide to take action.

### The practical starting point

You do not need a complete rebuild to fix a slow website. In most cases, the biggest gains come from a few specific changes: image optimization, eliminating unused CSS and JavaScript, and improving server response time.

We help with this as part of our SEO and site health work. If you have a website that feels sluggish and you want to know exactly what is causing it, start there.
`,
    contentAr: `## السرعة جزء من علامتك التجارية

معظم الشركات تعتبر الموقع البطيء مشكلة تقنية يحلها المطور بهدوء قبل الإطلاق. الواقع أكثر وضوحاً من ذلك.

عندما تستغرق الصفحة أكثر من ثلاث ثوانٍ للتحميل، يغادر كثير من الزوار قبل أن يروا أي شيء. لا ينتظرون. يذهبون إلى مكان آخر.

### ما يتضرر فعلياً

موقع بطيء يضر بأكثر من معدل الارتداد. يشكّل الانطباع. الصفحة البطيئة تقول للزائر أحد ثلاثة أشياء — الشركة لا تحترم وقته، لا تستثمر في الجودة، أو المنتج خلف الموقع يعمل بنفس الطريقة.

لا شيء من هذه الانطباعات تريد إحداثه.
`,
  },
  {
    slug: "what-every-small-business-website-is-missing",
    title: "The one thing every small business website is missing",
    titleAr: "الشيء الوحيد الذي يفتقده موقع كل شركة صغيرة",
    excerpt: "It is not a new design, more pages, or better photography. It is a clear answer to the question every visitor is asking silently.",
    excerptAr: "ليس تصميماً جديداً أو مزيداً من الصفحات. إنه إجابة واضحة على السؤال الذي يطرحه كل زائر في صمت.",
    tags: ["Strategy", "Web"],
    tagsAr: ["الاستراتيجية", "الويب"],
    order: 2,
    publishedAt: now,
    status: "PUBLISHED" as const,
    content: `## What visitors are really asking

Every person who lands on your website is asking the same question in the first few seconds: "Is this for me?"

Not "Is this nice?" Not "Is this well-designed?" Not "How long did this take to build?"

Is this for me?

If your homepage cannot answer that clearly within the first scroll — through the headline, the subheadline, and the first paragraph — a large share of your visitors will leave assuming the answer is no.

### The homepage problem

Most small business websites are built from the owner's perspective, not the visitor's. They explain what the company does, how long it has existed, what values the team holds, and what the founder believes. These things matter — but they are answers to questions the visitor has not asked yet.

The first thing a visitor needs is not your story. It is confirmation that you solve a problem they recognize.

### What actually works

A homepage that converts starts with a single clear sentence that names the person it is for and the result it delivers. Not a tagline. A sentence.

Something like: "We help healthcare clinics turn their online presence into a booking machine." That is specific. It names the audience. It names the outcome.

After that sentence, the homepage earns the right to explain how, why, and who.

### Signs your homepage is not clear enough

- Visitors spend a lot of time on the homepage and do not contact you
- You have to explain your business verbally to people who already visited your website
- The most common question from leads is "what exactly do you do?"
- You have a great conversion rate with referrals but almost nothing from organic traffic

All of these point to the same root cause: the homepage is not answering the one question fast enough.

### How to fix it

You do not need a redesign. You may need to rewrite the headline, tighten the subheadline, and remove sections that answer questions visitors have not asked yet.

We do this as part of most of our web projects — not as a copywriting service, but as a structural thinking step. The design can be beautiful. If the first message is unclear, the design is working against you.
`,
    contentAr: null,
  },
  {
    slug: "design-systems-that-stay-useful",
    title: "Design systems that actually stay useful",
    titleAr: "أنظمة التصميم التي تبقى مفيدة فعلاً",
    excerpt: "The smallest system that a growing product team can actually maintain is almost always better than the largest one they cannot.",
    excerptAr: "أصغر نظام يمكن لفريق المنتج المتنامي الحفاظ عليه فعلاً يكون دائماً أفضل من الأكبر الذي لا يستطيعون ذلك.",
    tags: ["Design", "Systems"],
    tagsAr: ["التصميم", "الأنظمة"],
    order: 3,
    publishedAt: now,
    status: "PUBLISHED" as const,
    content: `## What a design system is not

A design system is not a Figma file with 400 components. It is not a color palette document that lives in a shared drive. It is not a component library that takes six months to build before anyone ships a feature.

A design system is a shared language. Tokens, components, and guidelines that let a team make consistent decisions without starting every screen from scratch.

### Why most design systems fail

They fail for a simple reason: they are built for a team size and a product complexity that do not exist yet.

A five-person startup building a design system that would impress a 200-person company is not preparing for success. It is delaying it. The system becomes a maintenance burden instead of a speed multiplier.

### What stays useful

The design systems that teams actually use for more than a few months share a few traits:

**They start with tokens, not components.** Color, typography, spacing, and motion defined as variables. These can be applied anywhere, changed globally, and extended easily as the product grows.

**They only contain what the product uses.** Every component that is not in the product is maintenance debt. Buttons, inputs, cards, navigation — build what you ship, not what you might ship.

**They are documented with examples, not descriptions.** Showing when to use something is more useful than describing what it is.

**They have a clear owner.** A design system without someone responsible for keeping it current becomes a graveyard of outdated components.

### The right starting point

If you are building a product and do not have a design system yet, start with the tokens. Colors, type scale, spacing scale, border radius. Give them names that mean something — not "gray-200" but "border-subtle." Not "24px" but "space-6."

That foundation will serve you well even before you have a single component defined.
`,
    contentAr: null,
  },
  {
    slug: "seo-basics-that-actually-move-the-needle",
    title: "The SEO basics that actually move the needle",
    titleAr: "أساسيات السيو التي تحدث فرقاً فعلياً",
    excerpt: "Most SEO advice is either too vague to act on or too tactical to apply without context. Here is what we actually focus on first.",
    excerptAr: "معظم نصائح السيو إما مبهمة جداً لتطبيقها أو تكتيكية جداً بدون سياق. إليك ما نركز عليه أولاً.",
    tags: ["SEO"],
    tagsAr: ["تحسين محركات البحث"],
    order: 4,
    publishedAt: now,
    status: "PUBLISHED" as const,
    content: `## SEO has a credibility problem

Half of what gets published about SEO is either outdated, too vague to act on, or written to rank for the term "SEO tips" rather than to actually help someone improve their website.

Here is what we focus on when we work on a site's search presence — in order of impact.

### 1. Fix indexation first

If Google cannot crawl and index your pages properly, everything else is a waste of time. Before working on keywords or links, check:

- Are your important pages indexed? (Use Google Search Console, not a guess)
- Is there a sitemap and is it submitted?
- Are any pages accidentally blocked by robots.txt or noindex tags?
- Is the site structure clean enough for crawlers to understand?

Most sites we audit have at least one of these problems.

### 2. Understand what your audience is actually searching

This is not about finding the highest volume keyword. It is about understanding what words your actual customers use to describe their problem.

The most useful tool here is not a keyword research platform. It is the sales calls, support emails, and conversation transcripts you already have. What exact words do people use to describe what they need?

Those words should appear naturally in your page titles, headings, and first paragraphs.

### 3. Get the page structure right

Every important page should have one clear topic and a heading structure that reflects it. H1 for the main topic, H2s for the main sub-topics, H3s for specifics within those sub-topics.

This is not just for search engines. It is how people skim a page before deciding to read it.

### 4. Make the content answerable

For any question your target customer might ask, your page should have the clearest, most direct answer available. Not the longest. The clearest.

Google has gotten much better at rewarding pages that actually answer questions rather than pages that mention the question many times.

### 5. Earn links naturally

Links from other websites still matter. But buying links, trading links, or building low-quality links is a risk that can set your site back significantly.

The most durable approach is creating something worth linking to — a resource, a clear guide, a tool, a well-explained case study — and then making sure the right people know it exists.

### The honest timeline

SEO takes time. Meaningful movement in competitive searches often takes six months or more. That is not a reason to delay — it is a reason to start now and do it right.
`,
    contentAr: null,
  },
  {
    slug: "what-makes-a-homepage-convert",
    title: "What actually makes a homepage convert",
    titleAr: "ما الذي يجعل الصفحة الرئيسية تحوّل الزوار فعلاً",
    excerpt: "Conversion rate is not a design metric. It is a clarity metric. Here is what we look at when a homepage is not performing.",
    excerptAr: "معدل التحويل ليس مقياس تصميم. إنه مقياس وضوح. إليك ما ننظر إليه عندما لا تؤدي الصفحة الرئيسية أداءً جيداً.",
    tags: ["Conversion", "UX"],
    tagsAr: ["التحويل", "تجربة المستخدم"],
    order: 5,
    publishedAt: now,
    status: "PUBLISHED" as const,
    content: `## Conversion is a clarity problem, not a design problem

When a homepage is not converting, the most common instinct is to redesign it. New layout, new colors, new images, new typography. Sometimes that helps. Most of the time, the problem is earlier than the design.

The real question is: does the page communicate clearly, in the right order, to the right person?

### The three things a homepage must do in the first viewport

Before a visitor scrolls, they should understand three things:

1. **What you do** — specific enough to be meaningful, not just "we help businesses grow"
2. **Who you do it for** — named or implied, so the visitor can self-select
3. **What the next step is** — one clear action, not five

If any of these are missing or buried, the page is working against itself.

### Why benefits-first works

Most homepages lead with the company. "We are X, founded in Y, and we believe in Z."

Visitors do not arrive with that question. They arrive with a problem. They want to know if you solve it.

Leading with the benefit — "Get a website that gets you leads" rather than "We build custom websites" — reduces the mental work the visitor has to do to understand why they should care.

### The scroll test

Open your homepage and stop after the first full screen. Without scrolling:

- Can you tell in one sentence what the company does?
- Is there a clear action you could take right now?
- Does it feel like it is talking to you or talking about itself?

If the answers are unclear, you have found the problem.

### What a good CTA actually does

A good call-to-action does not tell someone what to click. It tells them what will happen when they do.

"Contact us" is an instruction. "Get a free website audit" describes a result. "Start a project" moves the visitor forward. "Let's talk about your goals" frames the interaction as helpful.

The stronger the CTA, the lower the mental friction to take the action.

### The layout is not the problem

We have seen beautiful homepages that convert poorly and plain homepages that convert well. The difference is almost never the layout. It is the clarity of the message, the specificity of the offer, and whether the page treats the visitor as someone with a real problem to solve.

Design makes the message easier to receive. It does not replace having a clear message.
`,
    contentAr: null,
  },
  {
    slug: "why-we-stopped-using-templates",
    title: "Why we stopped using templates for client work",
    titleAr: "لماذا توقفنا عن استخدام القوالب في مشاريع العملاء",
    excerpt: "Templates are fast. They are also the reason most websites in the same industry look like they were built in the same afternoon.",
    excerptAr: "القوالب سريعة. لكنها أيضاً السبب في أن معظم المواقع في نفس الصناعة تبدو كأنها بُنيت في نفس الظهيرة.",
    tags: ["Web Development", "Process"],
    tagsAr: ["تطوير الويب", "العملية"],
    order: 6,
    publishedAt: now,
    status: "PUBLISHED" as const,
    content: `## The template argument

The argument for templates is strong: they are faster, cheaper to build on, and familiar to clients. The argument against is equally strong: they produce websites that look like other websites.

For some businesses, that is fine. For most of the clients we work with, it is not.

### What a template actually gives you

A template gives you a structure built around assumptions about what most businesses need. That structure is often reasonable. The homepage has a hero. The about page has a team section. The services page lists services.

The problem is that the structure is designed for the average business, and the average business is not your business.

When you build on a template, you spend a significant amount of time working around the decisions the template made — moving sections, removing features, fighting the CSS to make something look intentional instead of default.

### What custom actually means

Custom does not mean expensive or slow. It means the structure of the website is designed around your business logic, your content, and your audience — not around the assumptions of a theme author who had never heard of you.

A custom structure lets you place emphasis where your business actually needs it. If your testimonials are unusually strong, they can anchor the homepage. If your process is what differentiates you, it gets a prominent section. If your client list is impressive, it is not buried below the fold.

### What we actually build on

We do not avoid all tools. We use frameworks, component libraries, and CMS platforms when they serve the project. The difference is that we make those choices based on what the project needs, not based on what saves setup time.

Sometimes that means Next.js with a custom CMS. Sometimes it means WordPress with a custom theme built from a design file. Sometimes it means something simpler.

The tool follows the project. The project does not follow the tool.

### The honest cost comparison

A template-based website is cheaper to start and more expensive to evolve. The closer it gets to what you actually need, the more it fights back.

A custom website is more expensive to start and cheaper to evolve. The structure was built for you, so extending it is straightforward.

Most of the clients we have had the longest relationship with chose custom from the beginning. Not because they were sold on it, but because they had tried templates before and hit the ceiling.
`,
    contentAr: null,
  },
];

async function main() {
  console.log("Seeding blog posts…");
  let created = 0;
  let updated = 0;

  for (const post of POSTS) {
    const result = await prisma.post.upsert({
      where:  { slug: post.slug },
      update: { ...post },
      create: { ...post },
    });
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
  }

  console.log(`✓ Posts seeded — ${created} created, ${updated} updated`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
