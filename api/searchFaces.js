// Vercel Serverless Function to proxy Face++ API calls
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selfieBase64, facesetToken } = req.body;

    if (!selfieBase64 || !facesetToken) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Call Face++ API using URLSearchParams (no external dependencies needed)
    const params = new URLSearchParams();
    params.append('api_key', process.env.VITE_FACEPP_API_KEY);
    params.append('api_secret', process.env.VITE_FACEPP_API_SECRET);
    params.append('image_base64', selfieBase64);
    params.append('faceset_token', facesetToken);

    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const data = await response.json();

    if (data.error_message) {
      return res.status(400).json({ error: data.error_message });
    }

    // Filter by confidence threshold (70%)
    const matches = (data.results || [])
      .filter(r => r.confidence >= 70)
      .map(r => ({
        face_token: r.face_token,
        confidence: r.confidence
      }));

    return res.status(200).json({ matches });

  } catch (error) {
    console.error('Search faces error:', error);
    return res.status(500).json({ error: error.message });
  }
}
