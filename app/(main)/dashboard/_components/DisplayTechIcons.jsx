"use client";

import { cn, getTechLogos } from "@/lib/utils";
import { useEffect, useState } from "react";

function DisplayTechIcons({ techStack }) {
  const [techIcons, setTechIcons] = useState([]);

  useEffect(() => {
    if (!Array.isArray(techStack) || techStack.length === 0) return;

    const fetchIcons = async () => {
      const logos = await getTechLogos(techStack);
      console.log("ICONS:", logos); // you WILL see this
      setTechIcons(logos);
    };

    fetchIcons();
  }, [techStack]);

  if (techIcons.length === 0) return null;

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-[#DDDFFF] rounded-full p-2 flex items-center justify-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>

          {/* 🔥 USE IMG FOR ICONS */}
          <img
            src={url}
            alt={tech}
            className="w-5 h-5"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default DisplayTechIcons;
