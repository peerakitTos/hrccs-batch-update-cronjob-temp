import { Connection, getConnection } from "typeorm";
import { DBProvider } from "../provider/db";


describe("test database connection",() => {
  let connection: Connection
  beforeAll(async () => {
    const dbProvider: DBProvider = new DBProvider();
    await dbProvider.connection();
    connection = getConnection();
  });

  afterAll(() => {
    connection.close()
  })

  it("is database connection valid", () => {
    expect(connection.isConnected).toEqual(true);
  });

});
