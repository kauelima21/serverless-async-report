import { randomUUID } from "node:crypto";
import { env } from "../../config/env";
import { getLeadsGenerator } from "../../db/getLeadsGenerator";
import { MPUManager } from "../../services/S3MPUManager";
import { mbToBytes } from "../../utils/mbToBytes";
import { getPresignedURL } from "../../utils/getPresignedURL";

const minChunkSize = mbToBytes(6);

export async function handler() {
  const fileKey = `${new Date().toString()}-${randomUUID()}.csv`;

  const mpu = new MPUManager(env.REPORTS_BUCKET, fileKey);
  await mpu.start();

  try {
    const header = "ID,Nome,E-mail,Cargo\n";
    let currentChunk = header;

    for await (const { Items: leads = [] } of getLeadsGenerator()) {
      currentChunk += leads.map(lead => (
        `${lead.id.S},${lead.name.S},${lead.email.S},${lead.jobTitle.S}\n`
      )).join("");

      const currentChunkSize = Buffer.byteLength(currentChunk, "utf-8");

      if (currentChunkSize < minChunkSize) {
        continue;
      }

      await mpu.uploadPart(Buffer.from(currentChunk, "utf-8"));

      currentChunk = "";
    }

    if (currentChunk) {
      await mpu.uploadPart(Buffer.from(currentChunk, "utf-8"));
    }

    await mpu.complete();
  } catch {
    await mpu.abort();
  }

  const presignedUrl = await getPresignedURL({
    bucket: env.REPORTS_BUCKET,
    fileKey,
  });

  // send the freaking email
}
