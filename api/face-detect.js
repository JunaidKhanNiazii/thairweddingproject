// Proxy: detect faces in an image file (base64) via Face++
import { FormData, Blob } from "formdata-node";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { imageBase64 } = req.body;
  const API_KEY = process.env.VITE_FACEPP_API_KEY;
  const API_SECRET = process.env.VITE_FACEPP_API_SECRET;

  try {
    // Convert base64 to blob
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const form = new FormData();
    form.set("api_key", API_KEY);
    form.set("api_secret", API_SECRET);
    form.set("image_file", new Blob([buffer], { type: "image/jpeg" }), "image.jpg");
    form.set("return_attributes", "none");

    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      body: form,
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
