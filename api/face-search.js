// Proxy: search a face token against an event FaceSet via Face++
// If FaceSet doesn't exist, creates it and rebuilds from faceTokens passed in

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { faceToken, eventId, threshold = 75, allFaceTokens = [] } = req.body;
  const API_KEY = process.env.FACEPP_API_KEY;
  const API_SECRET = process.env.FACEPP_API_SECRET;
  const BASE = "https://api-us.faceplusplus.com/facepp/v3";

  const post = async (url, params) => {
    const form = new URLSearchParams();
    form.append("api_key", API_KEY);
    form.append("api_secret", API_SECRET);
    Object.entries(params).forEach(([k, v]) => form.append(k, v));
    const r = await fetch(url, { method: "POST", body: form });
    return r.json();
  };

  try {
    // Try to search directly first
    let searchData = await post(`${BASE}/search`, {
      outer_id: eventId,
      face_token: faceToken,
      return_result_count: 100,
    });

    // If FaceSet doesn't exist, create it and populate with all known face tokens
    if (searchData.error_message === "INVALID_OUTER_ID") {
      // Create the FaceSet
      await post(`${BASE}/faceset/create`, {
        outer_id: eventId,
        display_name: eventId,
      });

      // Add all face tokens from existing photos in one call (max 1000 per call on free tier)
      if (allFaceTokens.length > 0) {
        await post(`${BASE}/faceset/addface`, {
          outer_id: eventId,
          face_tokens: allFaceTokens.slice(0, 1000).join(","),
        });
      }

      // Retry search
      searchData = await post(`${BASE}/search`, {
        outer_id: eventId,
        face_token: faceToken,
        return_result_count: 100,
      });
    }

    if (searchData.error_message) {
      return res.status(400).json({ error: searchData.error_message });
    }

    const results = (searchData.results || [])
      .filter((r) => r.confidence >= threshold)
      .map((r) => ({ faceToken: r.face_token, confidence: r.confidence }));

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
