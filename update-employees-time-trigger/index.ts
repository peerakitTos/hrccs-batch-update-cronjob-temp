import { AzureFunction, Context } from "@azure/functions";
import bootstrap from '../share-code/update-employee'
const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  var timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log(`>- [ DELAY ] Timer function is running late.`);
    return;
  }

  context.log(
    ">- [ Start ] updating Employees information start at:",
    new Date().toISOString()
  );

  await bootstrap(context);

  context.log(
    ">- [ END ] updating Employees information complete at:",
    new Date().toISOString()
  );

  context.log("Timer trigger function ran!", timeStamp);
};

export default timerTrigger;
