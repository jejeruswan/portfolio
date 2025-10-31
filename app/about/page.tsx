import NavBar from "@/components/NavBar";
import Typewriter from "@/components/Typewriter";
import PolaroidCard from "@/components/PolaroidCard";

export default function About() {
  const polaroidCards = [
    {
      image: "/images/card1.jpg", // Replace with your image paths
      description: "card 1",
      top: 600,
      left: 62.12,
      rotation: -4,
    },
    {
      image: "/images/card2.jpg",
      description: "card 2",
      top: 660,
      left: 264,
      rotation: 12,
    },
    {
      image: "/images/card3.jpg",
      description: "card 3",
      top: 617,
      left: 512,
      rotation: -1,
    },
    {
      image: "/images/card4.jpg",
      description: "card 4",
      top: 660,
      left: 743,
      rotation: 5,
    },
    {
      image: "/images/card5.jpg",
      description: "card 5",
      top: 587,
      left: 976,
      rotation: 3,
    },
    {
      image: "/images/card6.jpg",
      description: "card 6",
      top: 624,
      left: 1157.23,
      rotation: -8,
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000]">
      <NavBar />
      <main className="relative w-full min-h-screen">
        {/* I'm a */}
        <div
          className="absolute"
          style={{
            top: "290px",
            left: "108px",
            fontSize: "25px",
            letterSpacing: "0px",
            fontFamily: "var(--font-inter)",
          }}
        >
          I&apos;m a
        </div>

        {/* Typewriter text - product designer / girl obsessed with trying new things */}
        <div
          className="absolute italic"
          style={{
            top: "290px",
            left: "174px",
            fontSize: "25px",
            letterSpacing: "1px",
            fontFamily: "var(--font-instrument-serif)",
          }}
        >
          <Typewriter
            texts={["product designer", "girl obsessed with trying new things"]}
            className="italic"
          />
        </div>

        {/* Second line */}
        <div
          className="absolute"
          style={{
            top: "322px",
            left: "108px",
            fontSize: "25px",
            letterSpacing: "0px",
            fontFamily: "var(--font-inter)",
          }}
        >
          crafting{" "}
          <span
            className="italic"
            style={{ fontFamily: "var(--font-instrument-serif)", letterSpacing: "1px"}}
          >
            intuitive
          </span>{" "}
          systems that don&apos;t exist and guiding them to life.
        </div>

        {/* Polaroid Cards */}
        {polaroidCards.map((card, index) => (
          <PolaroidCard
            key={index}
            image={card.image}
            description={card.description}
            top={card.top}
            left={card.left}
            rotation={card.rotation}
          />
        ))}
      </main>
    </div>
  );
}