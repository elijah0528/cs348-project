"use client";

import { useQuery } from "@tanstack/react-query";

type TestData = {
  id: number;
  content: string;
  country: string;
};

export default function Home() {
  const { data, isLoading, error } = useQuery<TestData[]>({
    queryKey: ["test-data"],
    queryFn: async () => {
      const response = await fetch("/api/test");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-4">
      <h1 className="font-medium mb-4">Test Data</h1>
      <div className="space-y-2">
        {data?.map((item) => (
          <div key={item.id}>
            <div className="text-gray-900">{item.content}</div>
            <div className="text-gray-500">{item.country}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
