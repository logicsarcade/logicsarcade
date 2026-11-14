import RealtimeSync from "@/components/RealtimeSync";
import { getAllProjectsAdmin } from "./actions";
import ProjectsManager from "./ProjectsManager";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";

export const metadata = {
  title: "Projects Management — LogicsArcade Admin",
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <>
      <RealtimeSync tables={["projects"]} authenticated />
      <Cursor />
      <ParticleCanvas />

      <main style={{ minHeight: "100vh", paddingTop: 32, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div
          style={{
            position: "fixed",
            top: "30%",
            right: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <ProjectsManager projects={projects} />
      </main>
    </>
  );
}
