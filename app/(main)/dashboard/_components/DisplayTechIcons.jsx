"use client";
import { cn, getTechLogos } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

function DisplayTechIcons({ techStack }) {
  const [techIcons, setTechIcons] = useState([]);

  useEffect(() => {
    const fetchIcons = async () => {
      const logos = await getTechLogos(techStack);
      setTechIcons(logos);
    };

    if (techStack && techStack.length > 0) {
      fetchIcons();
    }
  }, [techStack]);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            'relative group bg-[#DDDFFF] rounded-full p-2 flex items-center justify-center',
            index >= 1 && '-ml-3'
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5 align-center"
          />
        </div>
      ))}
    </div>
  );
}

export default DisplayTechIcons;
