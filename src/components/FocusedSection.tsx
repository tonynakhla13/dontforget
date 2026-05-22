"use client";

import { ReactNode } from "react";

interface FocusedSectionProps {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function FocusedSection({
  id,
  title,
  children,
  className = "",
}: FocusedSectionProps) {
  return (
    <section id={id} className={`py-24 px-6 md:px-12 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-5xl md:text-6xl font-black text-black mb-16 leading-tight">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
