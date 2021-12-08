require("dotenv").config();
import { Context } from "@azure/functions";
import { Connection } from "typeorm";
import { Audience } from "../entities/audience.entity";
import { DBProvider } from "../provider/db";
import { LineProvider } from "../provider/line";

export const bootstrap = async function(context: Context) {
  try {
    const dbProvider: DBProvider = new DBProvider()
    const connection: Connection = await dbProvider.connection()
    const line_id: string[] = await dbProvider.findLineIds()
    const lineProvider: LineProvider = new LineProvider()
    const previousAudiences: Audience = await dbProvider.findAudience()
    const audiences = lineProvider.transformToAudienceOptions(line_id);
    const newAudienceGroup = await lineProvider.createUploadAudienceGroup({
      description: `ccs-all-${(new Date()).getTime()}`,
      audiences
    })
    context.log(`[Create Audience Group] - Create Audience Group`);
    context.log(`[Remove Previous Audience Group] - Removing previous audience group`)
    if(previousAudiences) {
      await lineProvider.deleteAudienceGroup(previousAudiences.audience_id)
      context.log(`[Remove Previous Audience Group] - Remove successfully.`)
    }

    await dbProvider.updateAudience(newAudienceGroup, audiences)

    connection.close()
  } catch(e) {
    context.log('[Error occurs] - ', e)
  }
}