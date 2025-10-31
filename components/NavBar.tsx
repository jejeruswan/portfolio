"use client";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm tracking-wider">
            JESSLYN RUSWAN
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
            <a
              href="about"
              className="text-sm hover:opacity-70 transition-opacity"
            >
              About
            </a>
            <a
              href="work"
              className="text-sm hover:opacity-70 transition-opacity"
            >
              Work
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
