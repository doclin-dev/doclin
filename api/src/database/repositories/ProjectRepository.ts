import { AppDataSource } from "../dataSource";
import { Project } from "../entities/Project";

export const ProjectRepository = AppDataSource.getRepository(Project).extend({
	findProjectsByOrganizationId(organizationId: string) {
		return this.findBy({ organizationId: organizationId });
	},

	findProjectById(projectId: number) {
		return this.findOneBy({ id: projectId });
	}
});
