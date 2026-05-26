// Proxy: detect faces via Face++
// Accepts either imageBase64 (selfie) or imageUrl (Storage URL)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { imageBase64, imageUrl } = req.body;
  const API_KEY = process.env.FACEPP_API_KEY;
  const API_SECRET = process.env.FACEPP_API_SECRET;

  try {
    let buffer;

    if (imageUrl) {
      // Fetch image from Firebase Storage server-side (no CORS issue)
      const imgRes = await fetch(imageUrl);
      const arrayBuf = await imgRes.arrayBuffer();
      buffer = Buffer.from(arrayBuf);
    } else if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, "base64");
    } else {
      return res.status(400).json({ error: "imageBase64 or imageUrl required" });
    }

    const boundary = "----FormBoundary" + Math.random().toString(36).substring(2);

    const textPart = (name, value) =>
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`;

    const filePart = (name, filename, data) =>
      Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: image/jpeg\r\n\r\n`),
        data,
        Buffer.from("\r\n"),
      ]);

    const body = Buffer.concat([
      Buffer.from(textPart("api_key", API_KEY)),
      Buffer.from(textPart("api_secret", API_SECRET)),
      Buffer.from(textPart("return_attributes", "none")),
      filePart("image_file", "image.jpg", buffer),
      Buffer.from(`--${boundary}--\r\n`),
    ]);

    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
      body,
    });

    const data = await response.json();
    await new Promise((r) => setTimeout(r, 1200));
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
