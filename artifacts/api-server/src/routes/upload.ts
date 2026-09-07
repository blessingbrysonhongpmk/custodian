import { Router, type IRouter } from "express";

const router: IRouter = Router();

// POST /api/upload — Process and validate photo upload for trees and checkpoints
router.post("/upload", (req, res) => {
  try {
    const { image, fileName, contentType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image payload provided" });
    }

    // Validate type if contentType is passed
    if (contentType && !contentType.startsWith("image/")) {
      return res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, and WebP images are permitted." });
    }

    // Estimate file size from base64 string
    const stringLength = image.length - (image.indexOf(",") + 1);
    const sizeInBytes = (stringLength * 3) / 4;
    const maxSize = 6 * 1024 * 1024; // 6 MB limit

    if (sizeInBytes > maxSize) {
      return res.status(413).json({ error: "Image exceeds 5MB size limit. Please compress or capture a smaller image." });
    }

    // If it's a data URL, return it directly or format as valid image reference
    const url = image.startsWith("data:image/")
      ? image
      : `data:${contentType || "image/jpeg"};base64,${image}`;

    return res.status(201).json({
      success: true,
      url,
      fileName: fileName || `tree_${Date.now()}.jpg`,
      sizeBytes: Math.round(sizeInBytes),
    });
  } catch (err: any) {
    console.error("POST /upload error:", err);
    res.status(500).json({ error: err.message || "Failed to process image upload" });
  }
});

export default router;
