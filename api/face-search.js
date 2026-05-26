// Proxy: search a face token against an event FaceSet via Face++
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { faceToken, eventId, threshold = 75 } = req.body;
  const API_KEY = process.env.FACEPP_API_KEY;
  const API_SECRET = process.env.FACEPP_API_SECRET;

  try {
    const form = new URLSearchParams();
    form.append("api_key", API_KEY);
    form.append("api_secret", API_SECRET);
    form.append("outer_id", eventId);
    form.append("face_token", faceToken);
    form.append("return_result_count", 100);

    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/search", {
      method: "POST",
      body: form,
    });
    const data = await response.json();
    if (data.error_message) return res.status(400).json({ error: data.error_message });

    const results = (data.results || [])
      .filter((r) => r.confidence >= threshold)
      .map((r) => ({ faceToken: r.face_token, confidence: r.confidence }));

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
