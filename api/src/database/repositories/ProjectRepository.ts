import { AppDataSource } from "../dataSource";
import { Project } from "../entities/Project";
import { ILike } from 'typeorm';

export const ProjectRepository = AppDataSource.getRepository(Project).extend({
	findProjectsByOrganizationId(organizationId: string) {
		return this.findBy({ organizationId: organizationId });
	},

	findProjectsByOrganizationIdAndGitUrl(organizationId: string, githubUrl: string) {
		return this.findBy({ organizationId: organizationId, url: ILike(`%${githubUrl}%`) });
	},

	findProjectById(projectId: number) {
		return this.findOneBy({ id: projectId });
	}
});
