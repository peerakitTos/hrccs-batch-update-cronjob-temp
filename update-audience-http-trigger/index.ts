import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { bootstrap } from "../share-code/audience";

const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  context.log("Update Audience HTTP Trigger processed the request.");

  context.log(
    ">- [ Start ] updating Audience information start at:",
    new Date().toISOString()
  );

  await bootstrap(context);

  context.log(
    ">- [ END ] updating Audience information complete at:",
    new Date().toISOString()
  );

  const responseMessage =
    "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  context.res = {
    body: responseMessage,
  };
};

export default httpTrigger;
