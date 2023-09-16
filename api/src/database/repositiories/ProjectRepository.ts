import { AppDataSource } from "../dataSource";
import { Project } from "../entities/Project";
import { ILike } from 'typeorm';

export const ProjectRepository = AppDataSource.getRepository(Project).extend({
    getProjectsByCompanyId(companyId: number) {
        return this.findBy({ companyId: companyId });
    },

    getProjectsByCompanyIdAndGitUrl(companyId: number, githubUrl: string) {
        return this.findBy({ companyId: companyId, url: ILike(`%${githubUrl}%`) });
    }
});
