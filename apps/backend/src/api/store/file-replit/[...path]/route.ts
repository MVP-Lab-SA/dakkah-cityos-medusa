import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Client } from "@replit/object-storage";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const client = new Client();

  // Reconstruct key from [...path] param
  const pathParam = req.params.path;
  // If path is array (standard for [...path] files), join it.
  // Medusa (Express/Hono underlying) usually passes it as string or array depending on routing logic.
  // In standard JS/TS routing for [...path], it's often an array.

  // Wait, req.params.path is captured by the file name `[...path]`.
  // Let's verify what `req.params` looks like in Medusa.
  // Usually it works. Key: "path"

  let key = "";
  if (Array.isArray(pathParam)) {
    key = pathParam.join("/");
  } else {
    key = pathParam as string;
  }

  if (!key) {
    return res.status(400).json({ message: "File key is missing" });
  }

  // Stream file
  const { ok, value: stream, error } = await client.downloadAsStream(key);

  if (!ok) {
    // If not found, 404
    if (error?.toString().includes("not found")) {
      return res.status(404).json({ message: "File not found" });
    }
    return res
      .status(500)
      .json({ message: `Failed to retrieve file: ${error}` });
  }

  // Set headers (ContentType ideally, but Replit SDK might not give metadata?)
  // We can try to guess from extension.
  // stream is a ReadableStream or similar.
  // Medusa/Express response supports piping.

  // Pipe stream to res
  // 'value' from downloadAsStream is a standard Node Readable stream?
  // Docs say: "Download an object by streaming..." -> `value: stream`

  // Set basic content type based on extension
  const ext = key.split(".").pop()?.toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
  else if (ext === "png") contentType = "image/png";
  else if (ext === "gif") contentType = "image/gif";
  else if (ext === "webp") contentType = "image/webp";
  else if (ext === "svg") contentType = "image/svg+xml";
  else if (ext === "pdf") contentType = "application/pdf";

  res.setHeader("Content-Type", contentType);

  // Node stream piping
  // @ts-ignore - basic piping
  stream.pipe(res);
}
