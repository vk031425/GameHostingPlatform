const {
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const r2 = require("../config/r2");

const BUCKET = process.env.R2_BUCKET;

async function deleteAllObjects() {
  try {
    let continuationToken;

    do {
      const listResponse = await r2.send(
        new ListObjectsV2Command({
          Bucket: BUCKET,
          ContinuationToken: continuationToken,
        })
      );

      const objects = listResponse.Contents;

      if (!objects || objects.length === 0) {
        console.log("Bucket already empty.");
        return;
      }

      const deleteParams = {
        Bucket: BUCKET,
        Delete: {
          Objects: objects.map((obj) => ({ Key: obj.Key })),
        },
      };

      await r2.send(new DeleteObjectsCommand(deleteParams));

      console.log(`Deleted ${objects.length} objects`);

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    console.log("Bucket cleaned successfully.");
  } catch (err) {
    console.error("Error deleting objects:", err);
  }
}

deleteAllObjects();