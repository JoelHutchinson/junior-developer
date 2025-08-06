"use client";

import { EnrichedSource } from "@/utils/types";
import Image from "next/image";

interface SourceProps {
  source: EnrichedSource;
  number: number;
}

export default function Reference(props: SourceProps) {
  return (
    <li
      key={props.source.id}
      id={`reference-${props.source.id}`}
      className="flex items-center gap-2"
    >
      <span>{props.number}.</span>
      {props.source.favicon_url && (
        <Image
          src={props.source.favicon_url}
          alt={`${props.source.title} favicon`}
          width={16}
          height={16}
        />
      )}
      <a
        href={props.source.source}
        target="_blank"
        rel="noopener noreferrer"
        className="link-primary"
      >
        {props.source.title}
      </a>
    </li>
  );
}
