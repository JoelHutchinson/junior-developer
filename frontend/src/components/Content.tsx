"use client";

import { EnrichedData, EnrichedSource } from "@/utils/types";
import Reference from "@/components/Reference";

interface ContentProps {
  data: EnrichedData;
}

export default function Content(props: ContentProps) {
  return (
    <div className="border-2 border-gray-300 rounded-md flex flex-col gap-6 bg-white text-gray-800">
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">Advice</h3>

        {/* NOTE: In production, we would sanitize this HTML content (ideally on the back-end) */}
        <div dangerouslySetInnerHTML={{ __html: props.data.content }}></div>
      </div>

      <div className="bg-blue-50 p-4">
        <h3 className="font-bold text-xl mb-2">References</h3>
        <ul className="pl-1 space-y-1">
          {props.data.sources.map((source: EnrichedSource, index: number) => (
            <Reference key={source.id} source={source} number={index + 1} />
          ))}
        </ul>
      </div>
    </div>
  );
}
