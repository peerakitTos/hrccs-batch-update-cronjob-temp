require("dotenv").config();
import { Context } from "@azure/functions";
import { AxiosResponse } from "axios";
import "reflect-metadata";
import {
  Connection,
  getConnection,
  getRepository,
  LessThan,
  Repository,
} from "typeorm";
import { Employee } from "../entities/employee.entity";
import { DBProvider } from "../provider/db";
import { getUpdatedEmployeeInfo } from "../provider/helper";
import { sendReport } from "../provider/mail";
import { RawEmployee, ResponseData, TransformedEmployee } from "../type/type";

let insert_count = 0;
let update_count = 0;
let noneCCS_count = 0;
let error_count = 0;
let insert_result = [];
let noneCCS_result = [];
let error_result = [];
let now = new Date();

export const employeeObjectTransformation = function (
  data: any
): TransformedEmployee {
  try {
    return {
      person_id: data["WS.PERSON_ID"],
      personnel_number: data["WS.PERSONNEL_NUMBER"],
      scg_employee_id: data["WS.SCG_EMPLOYEE_ID"],
      name_prefix_th: data["WS.NAME_PREFIX_THAI"],
      first_name_th: data["WS.FIRST_NAME_THAI"],
      last_name_th: data["WS.LAST_NAME_THAI"],
      nickname: data["WS.NICK_NAME"],
      position_name_th: data["WS.POSITION_NAME_THAI"],
      company: data["WS.COMPANY_THAI"],
      business_unit: data["WS.SUB1_BUSINESS_UNIT_THAI"],
      division: data["WS.DIVISION_THAI"],
      department: data["WS.DEPARTMENT_THAI"],
      employment_status: data["WS.EMPLOYMENT_STATUS_TEXT"],
      contract_type: data["WS.EMPLOYEE_GROUP_TEXT"],
      username: data["WS.EMAIL_ADDRESS_BUSINESS"],
      email: data["WS.EMAIL_ADDRESS_BUSINESS"],
      pl: data["WS.SCG_PL_CODE"],
      scg_pl: data["WS.SCG_PL_CODE"],
      sub1_shift_th: data["WS.SUB1SHIFT_THAI"],
      shift_th: data["WS.SHIFT_THAI"],
      sub1_section_th: data["WS.SUB1SECTION_THAI"],
      section_th: data["WS.SECTION_THAI"],
      sub1_department_th: data["WS.SUB1DEPARTMENT_THAI"],
      sub1_division_th: data["WS.SUB1DIVISION_THAI"],
      sub1_company_th: data["WS.SUB1COMPANY_THAI"],
      sub1_1_business_unit_th: data["WS.SUB11_BUSINESS_UNIT_THAI"],
      business_unit_desc_th: data["WS.BUSINESS_UNIT_DESCRIPTION_THAI"],
      updated_at: new Date(),
    };
  } catch (e) {
    throw e;
  }
};

const bootstrap = async function (context: Context) {
  const dbProvider: DBProvider = new DBProvider();

	context.log("[ DB Connection ] - database connecting...");
  const connection: Connection = await dbProvider.connection();
  if (!connection.isConnected) {
    context.log(
      "[ DB Connection failed ] - database connection is not establish."
    );
    // send email about failure
    return;
  }
  context.log("[ DB Connected ] - database connection establish.");

  try {
    const res: AxiosResponse = await getUpdatedEmployeeInfo();
    const data: ResponseData = res.data;
    const rawEmployees: RawEmployee[] =
      data["WS.e2e_bluenet_upload_employeeResponse"][
        "WS.e2e_bluenet_upload_employeeOutput"
      ]["WS.row"];

    context.log(
      "[ Updating Data to Database ] - updating Employees information to Database at ",
      now.toISOString()
    );

    const totalEmployee: number = rawEmployees.length;
    for (const [i, rawEmployee] of rawEmployees.entries()) {
      context.log(`> processing::: ${i + 1}/${totalEmployee}`);
      const employee: TransformedEmployee =
        employeeObjectTransformation(rawEmployee);
      await processToDataBase(dbProvider, employee);
    }
    await updateNoneCCSEmployee(dbProvider);

		context.log("[ Sending Report to Email ] - sending email");

		const emailReport = await sendReport({
			result_total: totalEmployee,
			result_insert: insert_count,
			result_update: update_count,
			result_resign: noneCCS_count,
			result_error: error_count,
			result_insert_list: insert_result,
			result_resign_list: noneCCS_result,
			result_error_list: error_result,
		});

		context.log(
			"[ Report sent!! ] - status code::",
			emailReport[0].statusCode
		);

		context.log("total Insert:::", insert_count);
		context.log("total Update:::", update_count);
		context.log("total None CCS:::", noneCCS_count);
		context.log("total Error:::", error_count);
		connection.close();


  } catch (e) {
    context.log("[ Error Occur ] -", e);
    //send Email about Failure
    return;
  }
};

const processToDataBase = async function (
  dbProvider: DBProvider,
  transformedEmployee: TransformedEmployee
) {
  try {
    if (!transformedEmployee.email) {
      throw new Error("No email on this employee.");
    }
    let employee: Employee = await dbProvider.findOne(
      transformedEmployee.email
    );

    if (employee) {
      const updateStatus: boolean = await dbProvider.updateToDatabase(
        employee.email,
        transformedEmployee
      );
      if (!updateStatus) {
        throw new Error(`Cannot update this employee - ${employee.email}`);
      }
      update_count++;
      return;
    }

    const insertedEmployee: Employee = await dbProvider.insertToDatabase(
      now,
      transformedEmployee
    );
    if (!insertedEmployee) {
      throw new Error(`Cannot insert this employee - ${employee.email}`);
    }
    insert_count++;
    insert_result.push({
      email: transformedEmployee.email,
      name: `${transformedEmployee.first_name_th} ${transformedEmployee.last_name_th}`,
    });
    return;
  } catch (e) {
    error_result.push({
      personelId: transformedEmployee.person_id,
      name: `${transformedEmployee.first_name_th} ${transformedEmployee.last_name_th}`,
      error: e.message,
    });
    error_count++;
  }
};

const updateNoneCCSEmployee = async function (dbProvider: DBProvider) {
  const midNightNow: Date = new Date(now);
  midNightNow.setUTCHours(0, 0, 0, 0);

  const noneCCSEmployee: [Employee[], number] = await dbProvider.updateNoneCCS(
    midNightNow
  );

	noneCCSEmployee[0].map((employee: Employee) => {
    noneCCS_result.push({
      email: employee.email,
      name: `${employee.first_name_th} ${employee.last_name_th}`,
    })
	});

	noneCCS_count = noneCCSEmployee[1];
};


export default bootstrap;
