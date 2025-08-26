import { NextResponse } from "next/server";

const API_KEY = process.env.ATTOM_API_KEY;
const BASE_URL =
  "https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile";

export const runtime = "edge";

export default async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Missing ATTOM API key" },
      { status: 500 }
    );
  }

  try {
    const allProperties: Record<string, unknown>[] = [];
    const pageSize = 100; // ATTOM allows up to 500
    let page = 1;
    let totalRecords = Infinity;

    while ((page - 1) * pageSize < totalRecords) {
      const url = new URL(BASE_URL);
      url.searchParams.set("postalcode", "80212"); // change as needed
      url.searchParams.set("page", page.toString());
      url.searchParams.set("pagesize", pageSize.toString());

      const response = await fetch(url.toString(), {
        headers: {
          accept: "application/json",
          apikey: API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `ATTOM API Error: ${response.statusText}`, details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();
      const properties = data?.property || [];

      if (properties.length === 0) break;

      allProperties.push(...properties);

      // read total from response metadata if available
      totalRecords = data?.status?.total || totalRecords;

      page++;
    }

    return NextResponse.json({
      total: allProperties.length,
      properties: allProperties,
    });
  } catch (error: unknown) {
    console.error("ATTOM API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ATTOM property data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
