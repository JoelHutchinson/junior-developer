"use client";

import { EnrichedData, EnrichedSource } from "@/utils/types";
import Reference from "@/components/Reference";

interface ContentProps {
  data: EnrichedData;
}

export default function Content(props: ContentProps) {
  return (
    <div className="border-2 border-gray-300 p-4 rounded-md flex flex-col gap-4 bg-white text-gray-800">
      <div dangerouslySetInnerHTML={{ __html: props.data.content }}></div>

      <div>
        <h3 className="font-semibold text-xl mb-1">References</h3>
        <ul>
          {props.data.sources.map((source: EnrichedSource, index: number) => (
            <Reference key={source.id} source={source} number={index + 1} />
          ))}
        </ul>
      </div>
    </div>
  );
}
