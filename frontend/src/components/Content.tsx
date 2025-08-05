"use client";

import Image from "next/image";

import { formatCategory } from "@/utils/formatting";
import { Data } from "@/utils/types";

interface ContentProps {
  data: Data;
}

export default function Content(props: ContentProps) {
  return (
    <div className="border-2 border-gray-300 p-4 rounded-md flex flex-col gap-2 bg-white text-gray-800">
      <h3 className="font-bold underline">
        {formatCategory(props.data.category)}
      </h3>

      <div dangerouslySetInnerHTML={{ __html: props.data.content }}></div>

      <div>
        <h4 className="font-semibold">Related articles:</h4>
        <ul>
          {props.data.sources
            .filter((source) => !source.cited)
            .map((source) => (
              <li key={source.id} className="flex items-center gap-2">
                {source.favicon && (
                  <Image
                    src={source.favicon}
                    alt={`${source.title} favicon`}
                    width={16}
                    height={16}
                  />
                )}
                <a
                  href={source.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-primary"
                >
                  {source.title}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
