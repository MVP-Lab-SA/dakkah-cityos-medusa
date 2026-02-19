import { AbstractFileProviderService } from "@medusajs/framework/utils";
import {
  FileProviderMethod,
  FileProviderUploadResponse,
  ProviderDeleteFileDTO,
  ProviderGetFileDTO,
  ProviderUploadFileDTO,
} from "@medusajs/framework/types";
import { Client } from "@replit/object-storage";
import { MedusaError } from "@medusajs/framework/utils";
const fs = require("fs");

type ReplitFileServiceOptions = {
  bucket_id?: string;
  backend_url?: string;
};

export class ReplitFileService extends AbstractFileProviderService {
  static identifier = "replit-file";
  protected client_: Client;
  protected bucketId_: string;
  protected backendUrl_: string;

  constructor(container: any, options: ReplitFileServiceOptions) {
    super(container, options); // No options passed to super in v2 abstract? Checking signatures logic.
    // In Medusa v2, options are 2nd arg.
    this.bucketId_ = options.bucket_id || process.env.REPLIT_BUCKET_ID || "";
    this.backendUrl_ =
      options.backend_url ||
      process.env.MEDUSA_BACKEND_URL ||
      "http://localhost:9000";
    this.client_ = new Client();
  }

  async upload(
    file: ProviderUploadFileDTO,
  ): Promise<FileProviderUploadResponse> {
    if (!file) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "No file provided");
    }

    // Read file content
    let content: Buffer;
    if (Buffer.isBuffer(file.content)) {
      content = file.content;
    } else {
      // Assume path if string (Medusa usually passes path for uploads from form-data)
      // Check if we need to read from path
      // In v2, file.content is Buffer.
      // Wait, checking types.
      content = Buffer.from(file.content as any);
    }

    const key = file.filename;
    // Replit Object Storage doesn't support folders natively but keys can contain slashes?
    // Docs: "file.json". We can try "path/to/file.jpg".

    // Upload
    const { ok, error } = await this.client_.uploadFromBytes(key, content);

    if (!ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to upload to Replit Storage: ${error}`,
      );
    }

    // Construct "public" URL (Proxied via backend)
    // URL Format: <backend_url>/store/file-replit/<key>
    // Should encode key components?
    const url = `${this.backendUrl_}/store/file-replit/${key}`;

    return {
      url,
      key,
    };
  }

  async delete(file: ProviderDeleteFileDTO): Promise<void> {
    const { ok, error } = await this.client_.delete(file.fileKey);
    if (!ok) {
      // Log but don't crash? Or throw?
      console.error(
        `Failed to delete file ${file.fileKey} from Replit Storage: ${error}`,
      );
    }
  }

  async getPresignedDownloadUrl(fileData: ProviderGetFileDTO): Promise<string> {
    // Replit doesn't provide signed URLs. Return our proxy URL.
    return `${this.backendUrl_}/store/file-replit/${fileData.fileKey}`;
  }
}
