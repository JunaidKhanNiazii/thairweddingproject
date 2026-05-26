// Proxy: search a face token against an event FaceSet via Face++
// Auto-creates FaceSet if missing and rebuilds from existing tokens

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    // Wait before first call to avoid overlap with detect call
    await sleep(1200);

    // Try search first
    let searchData = await post(`${BASE}/search`, {
      outer_id: eventId,
      face_token: faceToken,
      return_result_count: 100,
    });

    // If FaceSet doesn't exist, create it and populate
    if (searchData.error_message === "INVALID_OUTER_ID") {
      await sleep(1200);
      await post(`${BASE}/faceset/create`, {
        outer_id: eventId,
        display_name: eventId,
      });

      if (allFaceTokens.length > 0) {
        await sleep(1200);
        await post(`${BASE}/faceset/addface`, {
          outer_id: eventId,
          face_tokens: allFaceTokens.slice(0, 1000).join(","),
        });
      }

      await sleep(1200);
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
