import { AppDataSource } from "../dataSource";
import { Project } from "../entities/Project";
import { ILike } from 'typeorm';

export const ProjectRepository = AppDataSource.getRepository(Project).extend({
    findProjectsByCompanyId(organizationId: number) {
        return this.findBy({ organizationId: organizationId });
    },

    findProjectsByCompanyIdAndGitUrl(organizationId: number, githubUrl: string) {
        return this.findBy({ organizationId: organizationId, url: ILike(`%${githubUrl}%`) });
    }
});
