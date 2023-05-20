import { DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const testDataSourceOptions: DataSourceOptions = {
  type: "mariadb",
  host: process.env.DB_HOST,
  port: +process.env.TEST_DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.TEST_DB,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/common/database/migrations/*.ts"],
  synchronize: true,
  dropSchema: true,
};
