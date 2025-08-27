// app/api/portfolio/route.ts
export const runtime = "edge";

export default async function GET() {
  const portfolio = {
    value: 2500000,
    cashFlow: 6800,
    roi: 9.1,
    propertiesTracked: 12,
  };

  return Response.json(portfolio);
}
