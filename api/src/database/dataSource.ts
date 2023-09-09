import { join } from "path";
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "doclin",
    entities: [join(__dirname, "/entities/*.*")],
    synchronize: true
})