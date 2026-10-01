-- ============================================================
--  LogicsArcade — Blog Schema & Seed Data
--  Run this in Supabase Dashboard → SQL Editor → New Query
--  (Run AFTER the main schema.sql)
-- ============================================================

-- ─── BLOGS TABLE ─────────────────────────────────────────────

create table if not exists blogs (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  title         text        not null,
  slug          text        not null unique,
  excerpt       text        not null,
  content       text        not null,
  cover_image   text,
  category      text        not null,
  tags          text[]      not null default '{}',
  author_name   text        not null default 'LogicsArcade Team',
  read_time     int         not null default 5,
  is_published  boolean     not null default false,
  published_at  timestamptz,
  sort_order    int         not null default 0
);

alter table blogs enable row level security;

create index if not exists blogs_slug_idx        on blogs(slug);
create index if not exists blogs_published_idx   on blogs(is_published, published_at desc);
create index if not exists blogs_category_idx    on blogs(category);

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'blogs' and policyname = 'Published blogs are publicly readable'
  ) then
    create policy "Published blogs are publicly readable"
      on blogs for select using (is_published = true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'blogs' and policyname = 'Admins can manage blogs'
  ) then
    create policy "Admins can manage blogs"
      on blogs for all using (auth.role() = 'authenticated');
  end if;
end $$;


-- ─── SEED BLOGS (Real tech content) ──────────────────────────

insert into blogs (title, slug, excerpt, content, category, tags, author_name, read_time, is_published, published_at)
values

-- Blog 1: Next.js App Router
(
  'Next.js App Router vs Pages Router: Which Should You Use in 2025?',
  'nextjs-app-router-vs-pages-router-2025',
  'The App Router has been stable for over a year now. We break down the real-world differences, performance implications, and when to stick with Pages Router.',
  '<h2>Introduction</h2>
<p>When Next.js 13 introduced the App Router, it fundamentally changed how React applications are structured. Now that it has been stable for well over a year, the question every team faces is: should you migrate, and is it worth it for new projects?</p>
<p>At LogicsArcade, we have shipped production apps with both routers. Here is what we have learned.</p>

<h2>The Core Difference</h2>
<p>The biggest shift is the rendering model. The Pages Router uses a hybrid approach where you opt into server-side rendering per page using <code>getServerSideProps</code> or <code>getStaticProps</code>. The App Router flips this default: <strong>everything is a Server Component by default</strong>, and you opt into client-side rendering with the <code>"use client"</code> directive.</p>

<pre><code>// Pages Router — you opt IN to server rendering
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// App Router — server rendering is the DEFAULT
export default async function Page() {
  const data = await fetchData(); // runs on server
  return &lt;div&gt;{data}&lt;/div&gt;;
}</code></pre>

<h2>Performance: What the Numbers Say</h2>
<p>Server Components eliminate JavaScript from the client bundle for components that do not need interactivity. In a typical SaaS dashboard we built, moving to App Router reduced the initial JS bundle by <strong>38%</strong>. Time to First Byte improved because data fetching happens on the server, closer to the database.</p>
<p>However, App Router has more complex caching behavior. The four cache layers (Request Memoization, Data Cache, Full Route Cache, Router Cache) require a solid mental model to avoid stale data bugs.</p>

<h2>Developer Experience</h2>
<p>The App Router is more powerful but also more complex:</p>
<ul>
  <li><strong>Layouts</strong> are first-class and composable — a genuine improvement over Pages Router.</li>
  <li><strong>Nested routing</strong> is more intuitive with folder-based structure.</li>
  <li><strong>Server Actions</strong> simplify form handling without needing API routes for simple mutations.</li>
  <li><strong>Learning curve</strong> is steeper. Understanding when to use <code>"use client"</code>, how to pass server data to client components, and how caching works takes time.</li>
</ul>

<h2>When to Use App Router</h2>
<ul>
  <li>New projects — it is the future of Next.js and where all new features land.</li>
  <li>Content-heavy sites where SEO and performance are critical.</li>
  <li>Apps with complex nested layouts.</li>
  <li>Teams willing to invest time in understanding the new model.</li>
</ul>

<h2>When Pages Router Still Makes Sense</h2>
<ul>
  <li>Migrating large existing codebases — the cost may not justify the benefit yet.</li>
  <li>Teams with strong Pages Router expertise shipping under time pressure.</li>
  <li>Projects using libraries that have not fully adopted Server Component compatibility.</li>
</ul>

<h2>Our Recommendation</h2>
<p>For all new projects at LogicsArcade, we default to the App Router. The performance benefits are real, Server Actions clean up a lot of boilerplate, and it is clearly where Next.js investment is going. For existing projects, we do targeted migrations — moving the most performance-critical pages first rather than rewriting everything at once.</p>
<p>The Pages Router is not going anywhere. Next.js maintains it and will continue to do so. But if you are starting fresh today, App Router is the right choice.</p>',
  'Next.js',
  '{Next.js,React,App Router,Server Components,Performance}',
  'LogicsArcade Team',
  7,
  true,
  now() - interval '5 days'
),

-- Blog 2: React Native vs Flutter
(
  'React Native vs Flutter in 2025: A Practical Comparison for Your Next Mobile App',
  'react-native-vs-flutter-2025-comparison',
  'Both frameworks are mature and battle-tested. We compare them on performance, developer experience, ecosystem, and hiring — based on real projects, not benchmarks.',
  '<h2>The Short Answer</h2>
<p>If your team knows JavaScript and React, use React Native. If you are open to Dart and want the smoothest animations out of the box, Flutter is excellent. Both are production-ready — the choice depends on your team, not the technology.</p>
<p>Now for the longer answer, based on our experience shipping mobile apps with both.</p>

<h2>Performance</h2>
<p>Flutter has a clear advantage in animation performance. Because Flutter renders its own widgets using the Skia (now Impeller) graphics engine, it does not depend on native UI components. The result is pixel-perfect 60fps (or 120fps on ProMotion screens) animations with minimal effort.</p>
<p>React Native has improved dramatically with the New Architecture (JSI and Fabric). The JavaScript bridge that caused infamous performance issues is gone in modern React Native apps. For most business applications — forms, lists, navigation, data display — the performance difference between the two is imperceptible to users.</p>
<p>Where Flutter still leads: complex custom animations, games, and apps where every frame matters.</p>

<h2>Developer Experience</h2>
<p><strong>React Native wins if your team knows React.</strong> The mental model is identical — components, hooks, state management. You can share logic with your web app. The tooling has matured significantly with Expo, which abstracts away most native build complexity.</p>
<p>Flutter requires learning Dart, which is an approachable language but still a context switch. Hot reload is genuinely excellent. The widget system is consistent and comprehensive. Once you learn it, productivity is high — but the initial ramp-up is steeper.</p>

<h2>Ecosystem & Libraries</h2>
<p>React Native has a larger ecosystem simply because JavaScript has a larger ecosystem. Most third-party SDK providers (analytics, payments, maps) ship a React Native package first. Flutter support often comes later.</p>
<p>Flutter''s pub.dev has grown enormously and covers all common use cases. For standard app functionality, you will not be blocked. For cutting-edge or niche SDKs, React Native often has an advantage.</p>

<h2>Hiring & Team Fit</h2>
<p>React Native wins by a wide margin here. JavaScript and React developers are far more common than Dart and Flutter specialists. If you need to scale your team, React Native reduces the hiring pool constraint.</p>

<h2>Our Take</h2>
<p>At LogicsArcade, we primarily build with React Native for client projects. The main reasons: our team has deep React expertise, code sharing between web and mobile is a real productivity win for our clients, and the hiring market strongly favors JavaScript developers.</p>
<p>We reach for Flutter when a client specifically needs complex custom animations or when a project is entirely mobile-first with no web component — Flutter''s design capabilities are genuinely superior for those cases.</p>',
  'Mobile Apps',
  '{React Native,Flutter,Mobile Development,iOS,Android,Expo}',
  'LogicsArcade Team',
  8,
  true,
  now() - interval '12 days'
),

-- Blog 3: Supabase vs Firebase
(
  'Supabase vs Firebase: Which Backend Should You Choose for Your SaaS?',
  'supabase-vs-firebase-saas-backend',
  'We have built production SaaS products on both. Here is an honest comparison of cost, developer experience, scalability, and when each makes sense.',
  '<h2>Why This Comparison Matters</h2>
<p>Choosing a backend-as-a-service is one of the most consequential early decisions in a SaaS project. Migrating later is painful and expensive. We have built on both Firebase and Supabase in production, so this is based on real experience, not documentation reading.</p>

<h2>The Core Difference</h2>
<p><strong>Firebase</strong> is a NoSQL document database (Firestore) paired with a comprehensive suite of services: Auth, Storage, Cloud Functions, Hosting, Analytics, and more. It is a Google product with a long track record.</p>
<p><strong>Supabase</strong> is built on PostgreSQL and positions itself as an open-source Firebase alternative. It includes Auth, Storage, Edge Functions, and Realtime — but the database is a real relational database with SQL, indexes, foreign keys, and the full power of Postgres.</p>

<h2>Database: The Biggest Factor</h2>
<p>This is where the choice becomes clear for most SaaS products.</p>
<p>Firestore''s NoSQL model works well for simple, document-shaped data. But SaaS products almost always end up with relational data — users have organizations, organizations have subscriptions, subscriptions have invoices. Modeling this in Firestore leads to duplication, complex denormalization, or expensive reads.</p>
<p>Supabase gives you PostgreSQL. JOINs, transactions, constraints, views, stored procedures — everything that makes relational databases powerful for business data. For SaaS applications, this is almost always the right choice.</p>

<pre><code>-- Supabase: a clean relational query
select 
  u.email,
  o.name as org_name,
  s.plan,
  count(i.id) as invoice_count
from users u
join org_members om on om.user_id = u.id
join organizations o on o.id = om.org_id
join subscriptions s on s.org_id = o.id
left join invoices i on i.subscription_id = s.id
group by u.email, o.name, s.plan;</code></pre>

<p>Achieving the same in Firestore requires multiple queries and client-side joining.</p>

<h2>Pricing</h2>
<p>Firebase pricing is usage-based and can surprise you as you scale. Firestore charges per read, write, and delete — in a real-time app with frequent updates, costs can grow quickly and unpredictably.</p>
<p>Supabase uses a compute-based pricing model on paid plans. For most SaaS products in the early-to-mid growth stage, Supabase is significantly cheaper. The free tier is also more generous for development.</p>

<h2>Auth</h2>
<p>Both provide solid authentication. Firebase Auth has a slight edge in social provider breadth and mobile SDKs. Supabase Auth has caught up significantly and handles the important providers (Google, GitHub, email/password, magic link, phone OTP).</p>
<p>Supabase''s Row Level Security model, where auth policies live at the database level, is architecturally cleaner for multi-tenant SaaS.</p>

<h2>When to Choose Firebase</h2>
<ul>
  <li>Realtime-first apps (collaborative tools, live games) where Firestore''s realtime model fits naturally.</li>
  <li>Mobile-first apps with heavy use of Firebase ecosystem (Analytics, Crashlytics, Push Notifications).</li>
  <li>Teams already deep in the Google Cloud ecosystem.</li>
</ul>

<h2>When to Choose Supabase</h2>
<ul>
  <li>SaaS products with relational data — almost every B2B product.</li>
  <li>Teams comfortable with SQL (most backend developers are).</li>
  <li>Cost-sensitive early-stage startups.</li>
  <li>Products where data integrity and constraints matter.</li>
  <li>Open-source preference (you can self-host Supabase).</li>
</ul>

<h2>Our Default</h2>
<p>At LogicsArcade, Supabase is our default for new SaaS projects. The combination of PostgreSQL, built-in auth with RLS, and competitive pricing is hard to beat. We recommend Firebase primarily for mobile-first consumer apps where the broader Firebase ecosystem provides value.</p>',
  'SaaS',
  '{Supabase,Firebase,PostgreSQL,Backend,SaaS,Database}',
  'LogicsArcade Team',
  9,
  true,
  now() - interval '20 days'
),

-- Blog 4: Shopify App Development
(
  'Building Your First Shopify App in 2025: Everything You Need to Know',
  'building-shopify-app-2025-complete-guide',
  'Shopify''s app ecosystem generates billions for developers. We walk through the modern stack — Remix, Polaris, and App Bridge — with lessons from shipping real Shopify apps.',
  '<h2>Why Shopify Apps Are a Great Business</h2>
<p>The Shopify App Store has over 10,000 apps and generates significant revenue for developers. Merchants actively search for solutions to specific problems, and a well-positioned app can earn recurring subscription revenue from thousands of stores.</p>
<p>We have built several Shopify apps for clients, including our Arcade Shipping Calculator. Here is what the modern development experience looks like.</p>

<h2>The Modern Shopify App Stack</h2>
<p>Shopify has standardized on a specific set of technologies for app development:</p>
<ul>
  <li><strong>Remix</strong> — the recommended framework for embedded apps. Shopify created the <code>@shopify/app</code> template built on Remix.</li>
  <li><strong>Polaris</strong> — Shopify''s React design system. Using Polaris makes your app look native to the Shopify admin.</li>
  <li><strong>App Bridge</strong> — the JavaScript library that connects your embedded app to the Shopify admin interface.</li>
  <li><strong>Shopify CLI</strong> — the command-line tool for scaffolding, development, and deployment.</li>
</ul>

<pre><code>npx @shopify/create-app@latest my-shopify-app
cd my-shopify-app
npm run dev</code></pre>

<p>The CLI handles OAuth setup, tunnel creation for development, and app registration automatically.</p>

<h2>Types of Shopify Apps</h2>
<p><strong>Embedded apps</strong> live inside the Shopify admin. The merchant never leaves Shopify — your app renders within an iframe using App Bridge. This is the standard for admin tools.</p>
<p><strong>Theme app extensions</strong> add blocks to merchant storefronts without modifying theme code. This is the modern, upgrade-safe way to add storefront functionality.</p>
<p><strong>Web pixel extensions</strong> track storefront events for analytics and marketing.</p>
<p><strong>Shopify Functions</strong> let you customize Shopify''s backend logic — discounts, shipping rates, payment customization — with WebAssembly-compiled code that runs on Shopify''s infrastructure.</p>

<h2>Handling Billing</h2>
<p>Shopify provides a built-in billing API that charges merchants through their Shopify subscription. This is significant: merchants trust and are familiar with Shopify billing, and you avoid building payment infrastructure.</p>

<pre><code>// Create a recurring charge
const charge = await shopify.api.billing.request({
  session,
  plan: {
    chargeName: "Premium Plan",
    amount: 19.99,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
  },
  isTest: process.env.NODE_ENV !== "production",
});</code></pre>

<h2>Key Pitfalls to Avoid</h2>
<ul>
  <li><strong>Rate limits:</strong> Shopify''s REST API has rate limits. Use the GraphQL API where possible — it uses a cost-based system that is more predictable and generous.</li>
  <li><strong>Webhooks reliability:</strong> Webhooks can fail. Implement idempotent webhook handlers and use Shopify''s mandatory webhooks for GDPR compliance (customer data request, customer redact, shop redact).</li>
  <li><strong>Multi-store architecture:</strong> Your app will serve many stores. Every database record and API call must be scoped to the correct shop. Use the shop domain or myshopify domain as the tenant identifier.</li>
  <li><strong>App review:</strong> Shopify''s review process is thorough. Performance requirements are strict — your app''s pages must load in under 3 seconds.</li>
</ul>

<h2>Getting Into the App Store</h2>
<p>Shopify reviews every app before it is listed. The review focuses on: functionality (does it do what it claims), performance (load times), security (data handling, OAuth), and UX (Polaris compliance, mobile responsiveness).</p>
<p>Plan for 1–3 weeks for initial review, and ensure your app is thoroughly tested before submission.</p>',
  'Shopify & E-commerce',
  '{Shopify,Remix,Polaris,App Development,E-commerce}',
  'LogicsArcade Team',
  10,
  true,
  now() - interval '28 days'
),

-- Blog 5: AI Integration
(
  'Integrating AI Into Your Web App: A Practical Guide Using the Vercel AI SDK',
  'integrating-ai-web-app-vercel-ai-sdk',
  'Adding AI features to production apps is now straightforward — but there are real pitfalls around cost, latency, and user experience. Here is what we have learned.',
  '<h2>AI Features That Actually Provide Value</h2>
<p>Before writing a line of code, it is worth asking: what AI feature will users actually pay for or return for? The most successful AI integrations we have built share a pattern — they automate something genuinely tedious, not something users enjoy doing.</p>
<p>High-value AI features in web apps:</p>
<ul>
  <li>Summarizing long documents or conversations</li>
  <li>Drafting structured content from unstructured input (e.g., turning bullet points into a professional email)</li>
  <li>Classifying or tagging content automatically</li>
  <li>Answering questions about a specific knowledge base (RAG)</li>
  <li>Extracting structured data from free text</li>
</ul>

<h2>The Vercel AI SDK</h2>
<p>The Vercel AI SDK (<code>ai</code> package) is our recommended starting point for adding AI to Next.js apps. It provides:</p>
<ul>
  <li>A unified interface for OpenAI, Anthropic, Google, and other providers</li>
  <li>Streaming responses out of the box</li>
  <li>React hooks (<code>useChat</code>, <code>useCompletion</code>) for common UI patterns</li>
  <li>Tool calling (function calling) abstractions</li>
</ul>

<pre><code>// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant for our SaaS product.",
    messages,
  });

  return result.toDataStreamResponse();
}</code></pre>

<pre><code>// components/Chat.tsx
"use client";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    &lt;div&gt;
      {messages.map(m =&gt; (
        &lt;div key={m.id}&gt;{m.role}: {m.content}&lt;/div&gt;
      ))}
      &lt;form onSubmit={handleSubmit}&gt;
        &lt;input value={input} onChange={handleInputChange} /&gt;
        &lt;button type="submit"&gt;Send&lt;/button&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2>Managing Costs</h2>
<p>AI API costs can surprise you in production. Key strategies:</p>
<ul>
  <li><strong>Choose the right model:</strong> GPT-4o mini and Claude Haiku are 10–50x cheaper than frontier models and sufficient for most tasks. Reserve GPT-4o or Claude Sonnet for tasks requiring deep reasoning.</li>
  <li><strong>Cache responses:</strong> For deterministic inputs (e.g., summarizing the same document), cache the AI response. Redis or a database cache with a hash of the input as the key works well.</li>
  <li><strong>Limit context window:</strong> Long conversations cost more. Truncate history or summarize older messages.</li>
  <li><strong>Rate limit per user:</strong> Implement per-user daily or monthly AI usage limits, especially on free tiers.</li>
</ul>

<h2>Streaming for UX</h2>
<p>Always stream AI responses to the user. Waiting 5–10 seconds for a full response kills the experience. Streaming lets users start reading immediately and perceive the app as fast even when generation takes time.</p>

<h2>Prompt Engineering Tips</h2>
<ul>
  <li>Be specific about output format. If you need JSON, say "Respond only with valid JSON, no markdown." Then parse carefully.</li>
  <li>Use system prompts to constrain behavior and establish context.</li>
  <li>Include examples in the prompt (few-shot prompting) for consistent formatting.</li>
  <li>Validate and sanitize AI output before displaying or storing it — treat it like untrusted user input.</li>
</ul>

<h2>Error Handling</h2>
<p>AI APIs are probabilistic and occasionally fail or return unexpected output. Always wrap AI calls in try-catch, handle rate limit errors with exponential backoff, and provide graceful fallbacks. Never let an AI API error crash your app.</p>',
  'AI & Machine Learning',
  '{AI,Vercel AI SDK,OpenAI,Next.js,LLM,ChatGPT}',
  'LogicsArcade Team',
  8,
  true,
  now() - interval '35 days'
),

-- Blog 6: TypeScript tips
(
  '10 TypeScript Patterns That Make Your React Code Dramatically Better',
  'typescript-patterns-react-better-code',
  'After years of TypeScript in production React apps, these are the patterns we reach for constantly — from discriminated unions to template literal types.',
  '<h2>Why TypeScript Patterns Matter</h2>
<p>TypeScript is not just about adding type annotations. Used well, it catches entire categories of bugs at compile time, makes refactoring safe, and serves as documentation that is always up to date. These patterns have saved us from real production bugs.</p>

<h2>1. Discriminated Unions for State</h2>
<p>Instead of multiple boolean flags that can be in impossible states, use a discriminated union:</p>
<pre><code>// ❌ Allows impossible states
type State = {
  isLoading: boolean;
  data: User | null;
  error: string | null;
};

// ✅ Only valid states are representable
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; message: string };</code></pre>

<h2>2. Template Literal Types</h2>
<pre><code>type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize&lt;EventName&gt;}`;
// "onClick" | "onFocus" | "onBlur"

type CSSVariable = `--${string}`;
const color: CSSVariable = "--primary-color"; // valid
const bad: CSSVariable = "primary-color"; // TypeScript error</code></pre>

<h2>3. Exhaustive Switch with never</h2>
<pre><code>function getStatusLabel(status: "pending" | "active" | "cancelled"): string {
  switch (status) {
    case "pending": return "Waiting";
    case "active": return "Active";
    case "cancelled": return "Cancelled";
    default:
      const _exhaustive: never = status; // compile error if case is missing
      throw new Error(`Unhandled status: ${_exhaustive}`);
  }
}</code></pre>

<h2>4. Generic Component Props</h2>
<pre><code>interface SelectProps&lt;T&gt; {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
}

function Select&lt;T&gt;({ options, value, onChange, getLabel, getValue }: SelectProps&lt;T&gt;) {
  return (
    &lt;select value={getValue(value)} onChange={e => {
      const selected = options.find(o => getValue(o) === e.target.value);
      if (selected) onChange(selected);
    }}&gt;
      {options.map(opt => (
        &lt;option key={getValue(opt)} value={getValue(opt)}&gt;{getLabel(opt)}&lt;/option&gt;
      ))}
    &lt;/select&gt;
  );
}</code></pre>

<h2>5. Const Assertions for Config Objects</h2>
<pre><code>const ROUTES = {
  home: "/",
  blog: "/blog",
  admin: "/admin",
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES];
// "/" | "/blog" | "/admin"
// Adding a new route makes it automatically available in the type</code></pre>

<h2>6. Mapped Types for Form Errors</h2>
<pre><code>interface SignupForm {
  email: string;
  password: string;
  name: string;
}

type FormErrors = Partial&lt;Record&lt;keyof SignupForm, string&gt;&gt;;
// { email?: string; password?: string; name?: string }
// Automatically stays in sync with the form interface</code></pre>

<h2>7. Branded Types for IDs</h2>
<pre><code>type UserId = string & { readonly __brand: "UserId" };
type PostId = string & { readonly __brand: "PostId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User { ... }

const postId = createPostId("post_123");
getUser(postId); // TypeScript error — wrong brand!</code></pre>

<h2>8. Conditional Types for API Responses</h2>
<pre><code>type ApiResponse&lt;T&gt; = 
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchUser(id: string): Promise&lt;ApiResponse&lt;User&gt;&gt; {
  try {
    const user = await db.users.findById(id);
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: "User not found" };
  }
}

// Usage — TypeScript enforces the check
const result = await fetchUser("123");
if (result.success) {
  console.log(result.data.name); // type-safe access
} else {
  console.error(result.error);
}</code></pre>

<h2>9. Strict Event Handler Typing</h2>
<pre><code>// Instead of any in event handlers
function handleChange(e: React.ChangeEvent&lt;HTMLInputElement&gt;) {
  setValue(e.target.value);
}

function handleSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
  e.preventDefault();
  // ...
}

// For custom events with data
type CustomEvent&lt;T&gt; = { detail: T };
function handleCustom(e: CustomEvent&lt;{ userId: string }&gt;) {
  console.log(e.detail.userId);
}</code></pre>

<h2>10. Utility Type Combinations</h2>
<pre><code>interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
}

// Form for creating a user (no id or createdAt, role defaults)
type CreateUserInput = Omit&lt;User, "id" | "createdAt" | "role"&gt; & {
  role?: User["role"];
};

// For updating — all fields optional except id
type UpdateUserInput = Required&lt;Pick&lt;User, "id"&gt;&gt; & Partial&lt;Omit&lt;User, "id"&gt;&gt;;</code></pre>

<p>These patterns are not just syntactic tricks — they encode domain rules into the type system, turning potential runtime bugs into compile-time errors that you catch before they reach production.</p>',
  'JavaScript',
  '{TypeScript,React,Patterns,Best Practices,Frontend}',
  'LogicsArcade Team',
  9,
  true,
  now() - interval '42 days'
)

on conflict (slug) do nothing;
