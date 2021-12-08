import { AxiosResponse } from "axios";
import { getUpdatedEmployeeInfo } from "../provider/helper";
import { employeeObjectTransformation } from "../share-code/update-employee";
import { TransformedEmployee } from "../type/type";


describe("test api params",() => {
  let res: AxiosResponse;

  beforeAll(async () => {
    res = await getUpdatedEmployeeInfo()
  });

  it("is valid api", () => {
    expect(res.status).toBeDefined();
    expect(res.status).toEqual(200);
  });

  it("is data valid", () => {
    const data: any = res.data;
    const employees: any =
    data["WS.e2e_bluenet_upload_employeeResponse"][
        "WS.e2e_bluenet_upload_employeeOutput"
      ]["WS.row"];
    expect(employees).toBeDefined();
  });

  it("is data have correct params meter", () => {
    const data: any = res.data;
    const employee: any =
      data["WS.e2e_bluenet_upload_employeeResponse"][
        "WS.e2e_bluenet_upload_employeeOutput"
      ]["WS.row"][0];

    const transformedEmployee: TransformedEmployee =
      employeeObjectTransformation(employee);
    expect(transformedEmployee.person_id).toBeDefined();
    expect(transformedEmployee.personnel_number).toBeDefined();
    expect(transformedEmployee.scg_employee_id).toBeDefined();
    expect(transformedEmployee.name_prefix_th).toBeDefined();
    expect(transformedEmployee.first_name_th).toBeDefined();
    expect(transformedEmployee.last_name_th).toBeDefined();
    expect(transformedEmployee.nickname).toBeDefined();
    expect(transformedEmployee.company).toBeDefined();
    expect(transformedEmployee.business_unit).toBeDefined();
    expect(transformedEmployee.division).toBeDefined();
    expect(transformedEmployee.department).toBeDefined();
    expect(transformedEmployee.employment_status).toBeDefined();
    expect(transformedEmployee.contract_type).toBeDefined();
    expect(transformedEmployee.username).toBeDefined();
    expect(transformedEmployee.email).toBeDefined();
    expect(transformedEmployee.pl).toBeDefined();
    expect(transformedEmployee.scg_pl).toBeDefined();
    expect(transformedEmployee.sub1_shift_th).toBeDefined();
    expect(transformedEmployee.shift_th).toBeDefined();
    expect(transformedEmployee.sub1_section_th).toBeDefined();
    expect(transformedEmployee.section_th).toBeDefined();
    expect(transformedEmployee.sub1_department_th).toBeDefined();
    expect(transformedEmployee.sub1_division_th).toBeDefined();
    expect(transformedEmployee.sub1_company_th).toBeDefined();
    expect(transformedEmployee.sub1_1_business_unit_th).toBeDefined();
    expect(transformedEmployee.business_unit_desc_th).toBeDefined();
    expect(transformedEmployee.updated_at).toBeDefined();
  });
});
