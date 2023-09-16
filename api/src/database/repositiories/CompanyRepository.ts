import { AppDataSource } from "../dataSource";
import { Company } from "../entities/Company";

export const CompanyRepository = AppDataSource.getRepository(Company).extend({
    getCompanyById(id: number) {
        return this.findOneBy({ id: id });
    }
});
