// Proxy: add face tokens to a FaceSet via Face++
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { eventId, faceTokens } = req.body;
  const API_KEY = process.env.VITE_FACEPP_API_KEY;
  const API_SECRET = process.env.VITE_FACEPP_API_SECRET;

  try {
    const form = new URLSearchParams();
    form.append("api_key", API_KEY);
    form.append("api_secret", API_SECRET);
    form.append("outer_id", eventId);
    form.append("face_tokens", faceTokens.join(","));

    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/faceset/addface", {
      method: "POST",
      body: form,
    });
    const data = await response.json();
    if (data.error_message) return res.status(400).json({ error: data.error_message });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
