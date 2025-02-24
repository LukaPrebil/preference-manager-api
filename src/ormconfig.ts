import { DataSource } from "typeorm";
import { connectionConfig } from "./connectionConfig";

const dataSource = new DataSource(connectionConfig);
dataSource
  .initialize()
  .then(() => console.log("Database connection established"))
  .catch(console.error);

export default dataSource;
