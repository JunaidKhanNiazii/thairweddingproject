// Vercel serverless function — proxies Face++ API calls to avoid CORS
// All Face++ requests from the browser go through here

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { endpoint, body } = req.body;

  if (!endpoint || !body) {
    return res.status(400).json({ error: "Missing endpoint or body" });
  }

  const API_KEY = process.env.VITE_FACEPP_API_KEY;
  const API_SECRET = process.env.VITE_FACEPP_API_SECRET;
  const BASE_URL = "https://api-us.faceplusplus.com/facepp/v3";

  try {
    const form = new URLSearchParams();
    form.append("api_key", API_KEY);
    form.append("api_secret", API_SECRET);

    // Append all fields from body
    Object.entries(body).forEach(([key, value]) => {
      form.append(key, value);
    });

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      body: form,
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
