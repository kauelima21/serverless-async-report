import { 
  AbortMultipartUploadCommand,
  type CompletedPart, 
  CompleteMultipartUploadCommand, 
  CreateMultipartUploadCommand, 
  UploadPartCommand 
} from "@aws-sdk/client-s3";
import { s3Client } from "../clients/s3Client";

export class MPUManager {
  private uploadId: string | undefined;
  private partNumber = 1;
  private uploadParts: CompletedPart[] = [];

  constructor (private readonly bucketName: string, private fileKey: string) {}

  async start() {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
    });

    const { UploadId } = await s3Client.send(command);

    if (!UploadId) {
      throw new Error("Failed creating Multipart Upload.");
    }

    this.uploadId = UploadId;
  }

  async uploadPart(body: Buffer) {
    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
      UploadId: this.uploadId,
      PartNumber: this.partNumber,
      Body: body,
    });

    const { ETag } = await s3Client.send(command);

    this.uploadParts.push({
      ETag,
      PartNumber: this.partNumber,
    });

    this.partNumber++;
  }

  async complete() {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
      UploadId: this.uploadId,
      MultipartUpload: {
        Parts: this.uploadParts,
      },
    })

    await s3Client.send(command);
  }

  async abort() {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
      UploadId: this.uploadId,
    })

    await s3Client.send(command);
  }
}
