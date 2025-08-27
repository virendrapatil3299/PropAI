export const runtime = "edge";

export default async function GET() {
  const data = [
    {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      currentValue: 450000,
      cashFlow: 1200,
      roi: 8.5,
    },
    {
      address: "456 Sunset Blvd",
      city: "Los Angeles",
      state: "CA",
      currentValue: 780000,
      cashFlow: 2100,
      roi: 7.2,
    },
  ];

  return Response.json(data);
}
