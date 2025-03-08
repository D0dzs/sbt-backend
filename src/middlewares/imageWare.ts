import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { validateMIMEType } from "validate-image-type";

const imageWare = async (req: Request, res: Response): Promise<any> => {
  // temporarly solution
  if (req.path.endsWith("/")) res.redirect(301, req.path.slice(0, -1));

  try {
    const { path: folder, filename } = req.params;

    // Allow only "s" and "u" as valid paths
    if (!["s", "u"].includes(folder)) {
      return res.status(400).send("Couldn't find the file");
    }

    // Construct the full file path
    const filePath = path.join(__dirname, "..", "..", "images", folder, filename);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(path.join(__dirname, "..", "..", "images"))) {
      return res.status(400).send("Couldn't find the file");
    }

    // Check if file exists and is not a directory
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return res.status(404).send("Couldn't find the file");
    }

    // Define validation options
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    // Validate the image MIME type
    const valid = await validateMIMEType(filePath, { allowMimeTypes: allowedMimeTypes });

    if (valid) {
      return res.sendFile(filePath);
    } else {
      return res.status(403).send("Not a valid image file");
    }
  } catch (error) {
    return res.status(500).send("Failed to process request");
  }
};

export default imageWare;
