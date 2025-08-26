import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface College {
  id: number;
  "school.name": string;
  "school.city": string;
  "school.state": string;
  "school.zip": string;
  "school.school_url": string;
  "location.lat": number;
  "location.lon": number;
  "school.ownership": number;
  type?: string;
  image?: string;
}

// ✅ List of USA states + DC
const usStates = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!process.env.COLLEGE_API_KEY) {
      return res.status(500).json({ error: "Missing College API key" });
    }

    const { page = 0, per_page = 100 } = req.query;

    const response = await axios.get("https://api.data.gov/ed/collegescorecard/v1/schools", {
      params: {
        api_key: process.env.COLLEGE_API_KEY,
        "school.state": usStates.join(","), // ✅ restrict to USA states
        fields: [
          "id",
          "school.name",
          "school.city",
          "school.state",
          "school.zip",
          "school.school_url",
          "location.lat",
          "location.lon",
          "school.ownership"
        ].join(","),
        page,
        per_page,
      },
    });

    // Transform results to include type + logo
    const results: College[] = response.data.results.map((school: any) => {
      let type = "Other";
      if (school["school.ownership"] === 1) type = "Public";
      if (school["school.ownership"] === 2) type = "Private Nonprofit";
      if (school["school.ownership"] === 3) type = "Private For-Profit";

      const domain = school["school.school_url"]
        ? school["school.school_url"].replace(/^https?:\/\//, "").split("/")[0]
        : null;

      const image = domain
        ? `https://logo.clearbit.com/${domain}`
        : "https://via.placeholder.com/100?text=No+Logo";

      return {
        ...school,
        
        type,
        image,
      };
    });

    res.status(200).json({
      total: response.data.metadata.total, // ✅ total US colleges
      page: response.data.metadata.page,
      per_page: response.data.metadata.per_page,
      results,
    });
  } catch (error: any) {
    console.error("College API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch college data" });
  }
}
