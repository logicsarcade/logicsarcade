// Server Component — fetches data then passes it down as props.
// No "use client" here: this runs on the server at request time.
import JsonLd from "@/components/JsonLd";
import { webPageSchema, servicesListSchema } from "@/lib/schema";
import RealtimeSync from "@/components/RealtimeSync";
import { getProjects } from "@/lib/queries"; // getTestimonials hidden for now

import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
// import Testimonials from "@/components/Testimonials"; // hidden for now
import TechStack from "@/components/TechStack";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default async function Home() {
  // Runs on the server — both fetches happen in parallel
  const projects = await getProjects();
  // const testimonials = await getTestimonials(); // hidden for now

  return (
    <>
      <RealtimeSync tables={["projects"]} />
      <JsonLd data={[webPageSchema({ name: "LogicsArcade — Scalable Web & Mobile Apps", description: "Web, mobile, Shopify, SaaS and AI development by LogicsArcade.", path: "/" }), servicesListSchema()]} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects projects={projects} />
        <Process />
        {/* <Testimonials testimonials={testimonials} /> — hidden for now */}
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
