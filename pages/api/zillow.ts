// /pages/api/listings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const CLIENT_ID = process.env.ZILLOW_CLIENT_ID || "t8WzvJHXXUBvqpwSUrx5";
const CLIENT_SECRET = process.env.ZILLOW_CLIENT_SECRET || "VxDZpb65RAUXvk1Obqt93BeSRQaAbAg61Ybx9s1U";

// Step 1: Get Access Token
async function getAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      "https://api.bridgedataoutput.com/oauth2/token",
      null,
      {
        params: {
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error("❌ Failed to fetch Zillow Bridge API token");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    return null;
  }
}

// Step 2: API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return res.status(500).json({ error: "Unable to get Zillow access token (check server logs for details)" });
    }

    // Example: Fetch Zestimate data
    const response = await axios.get(
      "https://api.bridgedataoutput.com/api/v2/zestimates",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          address: "1600 Pennsylvania Ave NW, Washington, DC",
          limit: 5,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("❌ Zillow API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Zillow data" });
  }
}
