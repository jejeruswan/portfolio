"use client";

import Image from "next/image";

export interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  detailImage?: string; // Different image for the detail page
  detailContent?: string;
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
      className="w-full h-full transition-transform hover:scale-105"
      data-card-id={card.id}
    >
      <div className="w-full h-full bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
