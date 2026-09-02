// Server Component — fetches data then passes it down as props.
// No "use client" here: this runs on the server at request time.
import { getProjects, getTestimonials } from "@/lib/queries";

import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import TechStack from "@/components/TechStack";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default async function Home() {
  // Runs on the server — both fetches happen in parallel
  const [projects, testimonials] = await Promise.all([
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <>
      <Cursor />
      <ParticleCanvas />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects projects={projects} />
        <Process />
        <Testimonials testimonials={testimonials} />
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
