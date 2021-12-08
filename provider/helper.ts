const axios = require("axios");

/**
 * get employees data from portfolio
 */
export const getUpdatedEmployeeInfo = async () => {
  return axios({
    method: "get",
    url: 'https://apigwd.scg.com/DV/DEV/CBM_CCS/PEOPLE/APPLICATION/WE_ARE_CCS/WS/e2e_bluenet_upload_employee',
    auth: {
      username: process.env.AUTH_USER_NAME,
      password: process.env.AUTH_PASSWORD,
    },
  });
};
