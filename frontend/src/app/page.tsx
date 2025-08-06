import Image from "next/image";
import Content from "@/components/Content";

import { fetchData } from "@/utils/data";
import { EnrichedData } from "@/utils/types";
import { formatCategory } from "@/utils/formatting";

export default async function Home() {
  const data = await fetchData();

  const dataGroupedByCategory = data
    ? data.reduce(
        (acc: { [key: string]: EnrichedData[] }, item: EnrichedData) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        },
        {}
      )
    : {};

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col justify-center items-center w-full">
          <Image
            src="/logo.png"
            alt="Citizens Advice SORT"
            width={150}
            height={150}
            priority
          />
          <h1 className="text-2xl font-bold mt-4">Citizens Advice SORT</h1>
          <h2 className="text-lg font-medium">Junior Developer Practical</h2>
        </div>
        <div className="flex flex-col gap-8 w-full md:w-4/5 lg:w-3/4 mx-auto">
          {dataGroupedByCategory ? (
            Object.entries(dataGroupedByCategory).map(([category, items]) => (
              <div key={category} className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold mb-2">
                  {formatCategory(category)}
                </h3>
                {items.map((item: EnrichedData) => (
                  <Content key={item.id} data={item} />
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Loading content...</p>
          )}
        </div>
      </main>
    </div>
  );
}
