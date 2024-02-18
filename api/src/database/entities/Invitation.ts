import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn
} from "typeorm";
import { Organization } from "./Organization";
import { Project } from "./Project";

@Entity()
export class Invitation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expireAt: Date;

  @Column()
  email: string;

  @Column()
  invitationCode: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "organizationId" })
  organization: Organization;

  @Column()
  projectId: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "projectId" })
  project: Project;
}
