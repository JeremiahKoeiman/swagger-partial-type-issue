import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const dataSourceOptions: DataSourceOptions = {
  type: "mariadb",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/src/common/database/migrations/*.js"],
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
