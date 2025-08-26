import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type ApifyListing = {
  id?: number;
  zpid?: number;
  title?: string;
  price?: string;
  location?: string;
  url?: string;
  statusType?: string;
  imgSrc?: string;
  addressCity?: string;
  addressStreet?: string;
  addressState?: string;
  addressZipcode?: string;
  createdAt?: string;
  updatedAt?: string;
  lng?: number;
  latLong?: { latitude: number; longitude: number };
  baths?: number;
  beds?: number;
  homeType?: string;
  images?: string[];
};

const APIFY_DATASET_URLS = [
  
  "https://api.apify.com/v2/datasets/rl0FgEfLAkmaPrXOm/items?clean=true&format=json",
  "https://api.apify.com/v2/datasets/4SQEya8BAc0GPdKdo/items?clean=true&format=json", // keep but handle failure
  "https://api.apify.com/v2/datasets/619huxjJBmDbxpKSB/items?clean=true&format=json",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApifyListing[] | { error: string }>
) {
  try {
    // Fetch all datasets in parallel
    const datasets = await Promise.all(
      APIFY_DATASET_URLS.map(async (url) => {
        try {
          const { data } = await axios.get<ApifyListing[]>(url, {
            timeout: 15000, // prevent hanging
          });
          console.log(`✅ Fetched ${data.length} from ${url}`);
          return data;
        } catch (err: unknown) {
          console.warn(
            `⚠️ Skipped dataset ${url} - ${(err as Error).message || "Unknown error"}`
          );
          return [];
        }
      })
    );

    // Merge all results
    const allListings = datasets.flat();
    console.log("✅ Total listings fetched (before dedup):", allListings.length);

    // Deduplicate using id, zpid, or url
    const uniqueListings = Array.from(
      new Map(
        allListings.map((item) => [
          String(item.id ?? item.zpid ?? item.url ?? Math.random()),
          item,
        ])
      ).values()
    );

    console.log("✅ Total listings after dedup:", uniqueListings.length);

    res.status(200).json(uniqueListings);
  } catch (error: unknown) {
    console.error("❌ Error fetching dataset(s):", (error as Error).message || error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
}
