// lib/bridge.ts
export type Listing = {
  ListingKey: string;
  ListPrice?: number;
  BedsTotal?: number;
  BathsFull?: number;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  PropertyType?: string;
  StandardStatus?: string;
  PhotosCount?: number;
  Media?: Array<{ MediaURL?: string }>;
  UnparsedAddress?: string;
};

type SearchParams = {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  propertyType?: string; // e.g. "Residential"
  top?: number;          // total desired size across pages (OData $top semantics)
  pageSize?: number;     // requested page size (Bridge supports MaxPageSize header)
  page?: number;         // 1-based
};

const BASE = process.env.BRIDGE_API_BASE!;
const DATASET = process.env.BRIDGE_DATASET_ID!;
const TOKEN = process.env.BRIDGE_SERVER_TOKEN!;

function odataFilter(q: SearchParams) {
  const f: string[] = [];
  if (q.city) f.push(`City eq '${q.city.replace(/'/g, "''")}'`);
  if (q.state) f.push(`StateOrProvince eq '${q.state.replace(/'/g, "''")}'`);
  if (q.minPrice != null) f.push(`ListPrice ge ${q.minPrice}`);
  if (q.maxPrice != null) f.push(`ListPrice le ${q.maxPrice}`);
  if (q.minBeds != null) f.push(`BedsTotal ge ${q.minBeds}`);
  if (q.minBaths != null) f.push(`BathsFull ge ${q.minBaths}`);
  if (q.propertyType) f.push(`PropertyType eq '${q.propertyType.replace(/'/g, "''")}'`);
  return f.length ? `$filter=${encodeURIComponent(f.join(' and '))}` : '';
}

export async function fetchListings(q: SearchParams = {}) {
  if (!BASE || !DATASET || !TOKEN) {
    throw new Error('Bridge env vars are missing.');
  }

  // OData params
  const select =
    "$select=ListingKey,ListPrice,BedsTotal,BathsFull,City,StateOrProvince,PostalCode,PropertyType,StandardStatus,PhotosCount,UnparsedAddress";
  const orderby = "$orderby=ListPrice desc";
  const filter = odataFilter(q);
  const top = `$top=${q.top ?? 50}`;

  const url = `${BASE}/${encodeURIComponent(DATASET)}/Property?${[select, orderby, filter, top]
    .filter(Boolean)
    .join('&')}&access_token=${encodeURIComponent(TOKEN)}`;

  // Bridge is aligning $top with OData spec; page size should be set via Prefer: odata.maxpagesize. :contentReference[oaicite:2]{index=2}
  const pageSize = q.pageSize ?? 50;
  const page = Math.max(1, q.page ?? 1);

  // Next links are returned for pagination; we’ll “hop” page-1 times if needed.
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Prefer: `odata.maxpagesize=${pageSize}`,
  };

  let currentUrl = url;
  let response: any = null;
  for (let i = 0; i < page; i++) {
    const r = await fetch(currentUrl, { headers, cache: 'no-store' });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Bridge request failed (${r.status}): ${t}`);
    }
    response = await r.json();
    if (i < page - 1) {
      if (!response['@odata.nextLink']) break;
      // nextLink does not include access_token; append it safely
      const nextUrl = response['@odata.nextLink'];
      currentUrl = nextUrl.includes('access_token=')
        ? nextUrl
        : `${nextUrl}&access_token=${encodeURIComponent(TOKEN)}`;
    }
  }

  const items = (response?.value ?? []) as Listing[];
  const nextLink: string | undefined = response?.['@odata.nextLink'];

  return { items, nextLink };
}
