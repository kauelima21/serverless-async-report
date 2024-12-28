import { AttributeValue, ScanCommand } from "@aws-sdk/client-dynamodb";
import { env } from "../config/env";
import { dynamoClient } from "../clients/dynamoClient";

export async function* scanLeadsTable() {
  let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

  do {
    const command = new ScanCommand({
      TableName: env.LEADS_TABLE,
      ExclusiveStartKey: lastEvaluatedKey,
    });
  
    const { Items = [], LastEvaluatedKey } = await dynamoClient.send(command);

    lastEvaluatedKey = LastEvaluatedKey;
    yield Items
  } while (lastEvaluatedKey);
}
