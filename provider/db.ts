import {
  Connection,
  createConnection,
  getConnection,
  getRepository,
  LessThan,
  Repository,
} from "typeorm";
import { Audience } from "../entities/audience.entity";
import { Employee } from "../entities/employee.entity";
import { Identity } from "../entities/identity.entity";
import { TransformedEmployee } from "../type/type";

export class DBProvider {
  connection = async function (): Promise<Connection> {
    const connection: Connection = await createConnection({
      name: "default",
      type: "postgres",
      schema: "chatbot",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      entities: [Employee, Audience, Identity],
    });
    return connection;
  };

  insertToDatabase = async function (
    now: Date,
    transformedEmployee: TransformedEmployee
  ) {
    const connection: Connection = getConnection();
    if (!connection.isConnected) {
      throw Error(
        "[No Database Connection] - No Database Connection at this moment."
      );
    }
    const employeeRepository: Repository<Employee> = getRepository(Employee);
    return employeeRepository.save(
      employeeRepository.create({
        ...transformedEmployee,
        created_at: now,
      })
    );
  };

  findOne = async function (email: string): Promise<Employee> {
    const employeeRepository: Repository<Employee> = getRepository(Employee);
    return await employeeRepository.findOne({
      where: {
        email: email,
      },
    });
  };

  updateToDatabase = async function (
    email: string,
    transformedEmployee: TransformedEmployee
  ): Promise<boolean> {
    const employeeRepository: Repository<Employee> = getRepository(Employee);
    try {
      await employeeRepository.update({ email: email }, transformedEmployee);
      return true;
    } catch (e) {
      return false;
    }
  };

  updateNoneCCS = async function (now: Date): Promise<[Employee[], number]> {
    const employeeRepository: Repository<Employee> = getRepository(Employee);
    try {
      await employeeRepository.update(
        {
          updated_at: LessThan(now),
        },
        {
          employment_status: "N",
        }
      );
      return employeeRepository.findAndCount({
        where: {
          employment_status: "N",
        },
        select: ["id", "email", "first_name_th", "last_name_th"],
      });
    } catch (e) {
      return e;
    }
  };

  findLineIds = async function () {
    const identityRepository: Repository<Identity> = getRepository(Identity);
    try {
      const line_id = await identityRepository
        .createQueryBuilder("i")
        .leftJoin("i.employee", "em")
        .where({
          active: true,
        })
        .where("em.employment_status = :status", { status: "Y" })
        .orWhere("em.employment_status = :status", { status: "Active" })
        .select('i.line_user_id').getMany();

      return line_id.map((d: Identity) => d.line_user_id);
    } catch (e) {}
  };

  updateAudience = async function (
    audienceGroup: {
      audienceGroupId: number;
      type: string;
      description: string;
      created: number;
    },
    audiences: {
      id: string;
    }[]
  ): Promise<Audience> {
    const audienceRepository: Repository<Audience> = getRepository(Audience);
    const audience: Audience = await audienceRepository.findOne({
      order: {
        id: "DESC",
      },
    });
    const newAudience: Audience = audienceRepository.create({
      ...audience,
      description: audienceGroup.description,
      audience_id: `${audienceGroup.audienceGroupId}`,
      audience_count: audiences.length,
      audiences: audiences,
      created_by: 0,
      updated_by: 0,
    });
    return audienceRepository.save(newAudience);
  };

  
  findAudience = async function ():Promise<Audience> {
    const audienceRepository: Repository<Audience> = getRepository(Audience);
    return audienceRepository.findOne({
      order: {
        id: 'DESC'
      }
    })
  }
}
