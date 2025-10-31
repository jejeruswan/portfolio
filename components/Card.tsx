"use client";

import Image from "next/image";

export interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  detailImage?: string;
  detailContent?: string;
  slug: string; // URL slug for the project page
}

interface CardProps {
  card: CardData;
  onClick: () => void;
  style?: React.CSSProperties;
}

export default function Card({ card, onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className="w-full h-full transition-transform hover:scale-105 rounded-[15px] overflow-hidden"
      data-card-id={card.id}
    >
      <div className="w-full h-full bg-gray-800 rounded-[15px] shadow-2xl overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover rounded-[15px]"
          priority
        />
      </div>
    </div>
  );
}
