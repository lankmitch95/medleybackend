import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../db/dynamoClient";

export const handler = async () => {
  const table = "Medications"; // directly use your deployed table name

  const testItem = {
    patientId: "test-user",      // matches KeySchema in serverless.yml
    medicationId: "test-med-1",
    name: "Test Pill",
    scheduleType: "daily",
    times: ["08:00"],
    active: true,
  };

  try {
    // Write
    await docClient.send(new PutCommand({ TableName: table, Item: testItem }));

    // Read
    const result = await docClient.send(
      new GetCommand({
        TableName: table,
        Key: {
          patientId: "test-user",
          medicationId: "test-med-1",
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success", item: result.Item }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error", error: (err as Error).message }),
    };
  }
};
