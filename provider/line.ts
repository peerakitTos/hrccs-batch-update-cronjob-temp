import { Client } from "@line/bot-sdk";

const client = new Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_SECRET_KEY || "",
});

export class LineProvider {
  transformToAudienceOptions = function (lineIdArray: string[]) {
    return lineIdArray.map((lineId: string) => {
      return {
        id: lineId
      };
    });
  };

  createUploadAudienceGroup = async function (options): Promise<{
    audienceGroupId: number;
    type: string;
    description: string;
    created: number;
  }> {
    try {
      return client.createUploadAudienceGroup(options);
    } catch (e) {
      return e.response.data;
    }
  };

  deleteAudienceGroup = async function(audience_id: string): Promise<{}> {
    try {
      return client.deleteAudienceGroup(audience_id)
    } catch(e) {
      return e.response.data
    }
  }

  getAudienceGroup = async function (audienceGroupId) {};
}
