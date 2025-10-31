import NavBar from "@/components/NavBar";
import Carousel from "@/components/Carousel";
import { projects } from "@/data/projects";

export default function Work() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <NavBar />
      <main className="flex items-center justify-center min-h-screen">
        <Carousel cards={projects} />
      </main>
    </div>
  );
}
