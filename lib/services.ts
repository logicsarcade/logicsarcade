export interface Service {
  slug: string;
  icon: string;
  name: string;
  tagline: string;       // one line under the title on the detail page
  desc: string;          // short text used on cards
  overview: string[];    // paragraphs
  features: { title: string; desc: string }[];
  deliverables: string[];
  tech: string[];
  faqs: { q: string; a: string }[];
}

// To add a service later: add one object here. The home section, /services,
// /services/[slug], the sitemap and the 404 search all pick it up automatically.
export const SERVICES: Service[] = [
  {
    slug: "web-development",
    icon: "🌐",
    name: "Web Development",
    tagline: "Fast, scalable web applications and websites built on modern frameworks.",
    desc: "Full-stack applications built with modern frameworks. Performant, scalable, and production-ready from day one.",
    overview: [
      "We design and build full-stack web applications, business websites, dashboards, and customer portals. Every project is built with clean, maintainable code so it stays easy to extend as your business grows.",
      "From the first wireframe to the final deployment, we focus on speed, security, and search visibility, so your product works well for users and is easy for Google to understand.",
    ],
    features: [
      { title: "Custom web apps", desc: "Tailor-made applications built around your workflow, not around a template." },
      { title: "Performance first", desc: "Optimised loading, image handling, and caching for a fast experience on every device." },
      { title: "SEO-ready structure", desc: "Clean markup, metadata, sitemaps, and structured data built in from day one." },
      { title: "Secure by default", desc: "Authentication, validation, and safe data handling as standard practice." },
    ],
    deliverables: ["Responsive UI design and development", "Backend APIs and database design", "Admin panel or CMS", "Deployment and hosting setup", "Documentation and handover"],
    tech: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Tailwind CSS"],
    faqs: [
      { q: "Which technologies do you use?", a: "We mainly work with Next.js, React, Node.js, and TypeScript, paired with databases such as PostgreSQL or MongoDB. We choose the stack that fits your goals rather than following trends." },
      { q: "Can you improve or rebuild an existing website?", a: "Yes. We can audit your current site, fix performance and usability issues, or rebuild parts of it without losing your existing content and search rankings." },
      { q: "Will I be able to update the content myself?", a: "Yes. We can add a simple admin panel or CMS so you can edit pages, publish posts, and manage content without writing code." },
    ],
  },
  {
    slug: "mobile-apps",
    icon: "📱",
    name: "Mobile Apps",
    tagline: "Cross-platform iOS and Android apps from a single codebase.",
    desc: "Cross-platform iOS & Android apps with React Native. Native performance with a single codebase.",
    overview: [
      "We build mobile apps for iOS and Android using React Native, so you can reach both platforms with one team and one codebase. The result feels native, with smooth navigation, gestures, and device features.",
      "We handle everything from UX design and development to testing and App Store and Google Play publishing, and we can connect your app to your existing website or backend.",
    ],
    features: [
      { title: "One codebase, two platforms", desc: "Share most of the code between iOS and Android and ship updates to both together." },
      { title: "Native device features", desc: "Camera, location, push notifications, biometrics, and offline storage." },
      { title: "Smooth, polished UX", desc: "Interfaces designed for thumbs, small screens, and real-world use." },
      { title: "Store publishing", desc: "We prepare and submit your app to the App Store and Google Play." },
    ],
    deliverables: ["App UX and UI design", "iOS and Android builds", "Backend and API integration", "Push notifications and analytics", "Store listing support"],
    tech: ["React Native", "Expo", "TypeScript", "Firebase", "REST & GraphQL APIs", "Redux"],
    faqs: [
      { q: "Is React Native as good as native development?", a: "For most business and consumer apps, yes. React Native delivers near-native performance and lets you maintain a single codebase. We will tell you honestly if your idea needs fully native code." },
      { q: "Can the app work offline?", a: "Yes. We can store data on the device and sync it with your server when the connection returns." },
      { q: "Do you help publish the app?", a: "Yes. We prepare builds, screenshots, and listings and guide you through the App Store and Google Play review process." },
    ],
  },
  {
    slug: "shopify-apps",
    icon: "🛍️",
    name: "Shopify Apps",
    tagline: "Custom Shopify themes and private apps built for your store.",
    desc: "Custom Shopify themes and private apps. Revenue-focused solutions built for Shopify's ecosystem.",
    overview: [
      "We create custom Shopify themes, store customisations, and private or public apps that add exactly the functionality your store needs, without the bloat of many third-party plugins.",
      "Our work focuses on a clear shopping experience, fast pages, and features that support your business, such as custom product options, integrations, and automated workflows.",
    ],
    features: [
      { title: "Custom themes", desc: "Online Store 2.0 themes designed around your brand and your customers." },
      { title: "Private and public apps", desc: "Apps that extend Shopify with your own logic, built on Shopify's APIs." },
      { title: "Integrations", desc: "Connect your store to inventory, ERP, shipping, and marketing tools." },
      { title: "Speed and UX", desc: "Lean code and image optimisation to keep your store quick on mobile." },
    ],
    deliverables: ["Theme design and development", "Custom app development", "Third-party integrations", "Store performance review", "Testing and launch support"],
    tech: ["Shopify Liquid", "Shopify APIs", "Node.js", "React", "Polaris", "GraphQL"],
    faqs: [
      { q: "Can you customise my existing theme?", a: "Yes. We can extend your current theme with new sections and features, or build a fully custom one." },
      { q: "When do I need a custom app instead of an existing one?", a: "When you need a workflow or feature that no app on the Shopify App Store covers well, or when you want to avoid stacking several apps that slow the store down." },
      { q: "Do you build public apps for the Shopify App Store?", a: "Yes. We build both private apps for a single store and public apps designed for the App Store." },
    ],
  },
  {
    slug: "saas-development",
    icon: "⚡",
    name: "SaaS Development",
    tagline: "Multi-tenant SaaS platforms with authentication, billing, and dashboards.",
    desc: "Multi-tenant SaaS platforms with auth, billing, and dashboards — built to scale from 10 to 10,000 users.",
    overview: [
      "We help founders and teams turn a SaaS idea into a working product. We start with a focused MVP, then grow it with the features your users ask for.",
      "Our SaaS builds include the foundations every subscription product needs: secure accounts, roles and permissions, subscription billing, analytics, and an architecture that scales.",
    ],
    features: [
      { title: "MVP first", desc: "Launch the core of your idea quickly and learn from real users." },
      { title: "Multi-tenant architecture", desc: "Separate and secure data for every customer account." },
      { title: "Billing and subscriptions", desc: "Plans, trials, invoices, and payment handling through trusted providers." },
      { title: "Dashboards and analytics", desc: "Clear reporting for your users and for your own team." },
    ],
    deliverables: ["Product scoping and roadmap", "Authentication and roles", "Subscription billing", "User and admin dashboards", "Scalable cloud deployment"],
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redis", "Docker", "AWS"],
    faqs: [
      { q: "Can you start with an MVP?", a: "Yes, and we recommend it. A focused first version lets you validate demand before investing in a full feature set." },
      { q: "Will the product scale as we grow?", a: "We design the architecture with growth in mind, so it can handle more users and data without a rewrite." },
      { q: "Who owns the code?", a: "You do. We hand over the full source code and documentation at the end of the project." },
    ],
  },
  {
    slug: "ai-integrations",
    icon: "🤖",
    name: "AI Integrations",
    tagline: "Practical AI features woven into your product and workflows.",
    desc: "GPT-4, Claude, and custom ML pipelines woven into your product. Intelligent features that users actually love.",
    overview: [
      "We add useful AI features to websites, apps, and internal tools: chat assistants, document search, content generation, data extraction, and workflow automation.",
      "We focus on practical results. That means grounding answers in your own data, keeping a human in control of important decisions, and handling privacy and security carefully.",
    ],
    features: [
      { title: "AI assistants and chatbots", desc: "Assistants trained on your content to answer questions and guide users." },
      { title: "Search over your documents", desc: "Retrieval-augmented generation (RAG) so answers come from your own data." },
      { title: "Workflow automation", desc: "Agents and pipelines that handle repetitive, multi-step tasks." },
      { title: "Safe and responsible", desc: "Access controls, output checks, and logging for trustworthy results." },
    ],
    deliverables: ["Use-case discovery and feasibility", "Model and tool selection", "Integration into your product", "Testing with real examples", "Monitoring and improvement plan"],
    tech: ["OpenAI API", "Claude API", "LangChain", "Vector databases", "Python", "Node.js"],
    faqs: [
      { q: "Which AI models do you work with?", a: "We work with leading models from providers such as OpenAI and Anthropic, and choose the one that suits your task, privacy needs, and performance goals." },
      { q: "Can AI use my private data safely?", a: "Yes. We design the integration so your data is handled securely, with clear access rules and, where needed, no sharing beyond your own systems." },
      { q: "How do you reduce wrong answers?", a: "We ground the AI in your own content, test it against real examples, and add checks and human review for important decisions." },
    ],
  },
  {
    slug: "devops-cloud",
    icon: "🔒",
    name: "DevOps & Cloud",
    tagline: "Reliable deployments, automation, and monitoring for your product.",
    desc: "CI/CD pipelines, AWS/GCP deployments, and monitoring that keeps your product at 99.9% uptime.",
    overview: [
      "We set up the infrastructure and automation behind your product so releases are smooth, safe, and repeatable. No more manual deployments or guessing why the site is down.",
      "We work with AWS and Google Cloud, containerised applications, and automated pipelines, and we add monitoring and alerts so problems are caught early.",
    ],
    features: [
      { title: "CI/CD pipelines", desc: "Automatic testing and deployment every time you push code." },
      { title: "Cloud setup", desc: "Well-structured AWS or GCP environments for staging and production." },
      { title: "Monitoring and alerts", desc: "Dashboards and notifications that show the health of your product." },
      { title: "Security and backups", desc: "Access control, secrets management, and regular backups." },
    ],
    deliverables: ["Infrastructure design", "Automated build and deploy pipelines", "Containerisation with Docker", "Monitoring, logging, and alerts", "Runbooks and documentation"],
    tech: ["AWS", "Google Cloud", "Docker", "GitHub Actions", "Nginx", "Linux"],
    faqs: [
      { q: "Can you move my existing app to the cloud?", a: "Yes. We plan the migration to minimise downtime and make sure everything is tested before the switch." },
      { q: "Do you provide ongoing support?", a: "Yes. We can monitor your infrastructure, apply updates, and respond to incidents after launch." },
      { q: "Which platforms do you support?", a: "Mainly AWS and Google Cloud, plus VPS and platforms such as Vercel when they are the best fit." },
    ],
  },
  {
    slug: "seo",
    icon: "📈",
    name: "SEO Services",
    tagline: "Technical SEO, content strategy, and optimisation that grow your organic traffic.",
    desc: "Technical SEO, content strategy, and on-page optimization that help your site rank higher and bring in qualified traffic.",
    overview: [
      "We help your website get found on Google. Our SEO work combines a solid technical foundation with useful content, so search engines can understand your pages and the right people can find them.",
      "As a development team, we fix SEO problems at the source: site structure, speed, metadata, sitemaps, and structured data, instead of only giving you a list of recommendations.",
    ],
    features: [
      { title: "Technical SEO audit", desc: "We check crawling, indexing, site structure, redirects, and errors that hold rankings back." },
      { title: "On-page optimisation", desc: "Titles, descriptions, headings, internal links, and image text that match what people search for." },
      { title: "Content strategy", desc: "Keyword research and a blog plan that targets the questions your customers ask." },
      { title: "Speed and Core Web Vitals", desc: "Faster pages and a better experience, which supports both rankings and conversions." },
    ],
    deliverables: ["Full technical SEO audit", "Keyword and competitor research", "Metadata, sitemap, and robots.txt setup", "Structured data (schema) markup", "Search Console and analytics setup", "Monthly performance reporting"],
    tech: ["Google Search Console", "Google Analytics 4", "Lighthouse", "Schema.org", "XML sitemaps", "Next.js SEO"],
    faqs: [
      { q: "How long does SEO take to show results?", a: "SEO is a long-term effort. Technical fixes can help quickly, but ranking improvements usually build over several months as search engines re-evaluate your site." },
      { q: "Do you guarantee a number one ranking?", a: "No one can honestly guarantee that, because search engines make the final decision. We focus on proven practices that improve your visibility steadily." },
      { q: "Can you do SEO on a site you did not build?", a: "Yes. We audit any website and can implement the technical fixes ourselves or work with your current developers." },
    ],
  },
];

export const PROCESS = [
  { title: "Discovery", desc: "We learn about your goals, users, and requirements, then agree on scope and priorities." },
  { title: "Design", desc: "We plan the structure and design the experience, sharing it with you for feedback." },
  { title: "Build", desc: "We develop in clear stages with regular updates so you always see progress." },
  { title: "Launch & support", desc: "We test, launch, and stay available to improve and maintain your product." },
];

export function getService(slug: string) {
  return SERVICES.find(s => s.slug === slug);
}
